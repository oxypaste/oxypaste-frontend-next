"use client";

import {
  faEdit,
  faEllipsisV,
  faFile,
  faFloppyDisk,
  faPlus,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import {
  LANGUAGE_OPTIONS,
  SHORTCUTS,
  toLanguageEnum,
} from "@/utils/editor-commons";

import * as Tooltip from "@radix-ui/react-tooltip";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Globe, Globe2 } from "lucide-react";
import { Language } from "@/lib/models/paste.model";

interface FooterProps {
  language: string;
  setLanguage: (lang: Language) => void;
  title: string;
  setTitle: (title: string) => void;
  setIsAutoDetect: (val: boolean) => void;
  isPublic: boolean;
  setPublic: (val: boolean) => void;
  isEditor: boolean;
  handleSave: () => void;
  handleEdit: () => void;
  handleShare: () => void;
}

export default function EditorFooter({
  language,
  setLanguage,
  title,
  setTitle,
  setIsAutoDetect,
  isPublic,
  setPublic,
  isEditor,
  handleSave,
  handleEdit,
  handleShare,
}: FooterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLanguage(toLanguageEnum(value));
    setIsAutoDetect(value === ""); // true if "Auto Detect" is selected
  };

  // Blank functions for buttons
  const handleNew = () => {
    window.location.href = "/new";
  };

  const handleRaw = () => {
    window.location.href = window.location.href + "/raw";
  };

  const [showMenu, setShowMenu] = useState(false);

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const pressed = new Set<string>();

    const normalizeKey = (key: string) => key.toLowerCase();

    const handleKeyDown = (e: KeyboardEvent) => {
      pressed.add(normalizeKey(e.key));

      const matches = (shortcut: string[]) =>
        shortcut.every((code) => pressed.has(normalizeKey(code)));

      if (matches(SHORTCUTS.SAVE) && isEditor) {
        e.preventDefault();
        handleSave();
      } else if (matches(SHORTCUTS.EDIT) && !isEditor) {
        e.preventDefault();
        handleEdit();
      } else if (matches(SHORTCUTS.NEW) && !isEditor) {
        e.preventDefault();
        handleNew();
      } else if (matches(SHORTCUTS.RAW) && !isEditor) {
        e.preventDefault();
        handleRaw();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressed.delete(normalizeKey(e.key));
    };

    const handleBlur = () => {
      pressed.clear(); // Clear all keys if window loses focus
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isEditor, handleSave, handleEdit, handleNew, handleRaw]);

  return (
    <footer
      className="fixed bottom-0 right-0 h-12 w-full bg-gray-950 text-gray-200 border-t border-gray-800 px-4 py-2 flex justify-between items-center gap-2 shadow z-20"
      style={{}}
    >
      <div className="flex items-center gap-2">
        <label htmlFor="language-select" className="sr-only">
          Language
        </label>
        <select
          id="language-select"
          name="language"
          className="bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:outline-none"
          value={language}
          onChange={handleChange}
        >
          {LANGUAGE_OPTIONS.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <FooterInput
          onChange={onChangeTitle}
          target={true}
          title={title}
          value={title}
          isEditor={isEditor}
        />
        <button
          onClick={() => setPublic(!isPublic)}
          className="cursor-pointer flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          aria-label={isPublic ? "Set to private" : "Set to public"}
          type="button"
        >
          <Globe
            className={`w-5 h-5 transition-colors duration-200 ${
              isPublic
                ? "text-green-500"
                : "text-transparent stroke-[1.5] stroke-gray-400"
            }`}
          />
          <span className="text-sm text-white">
            {isPublic ? "Public" : "Private"}
          </span>
        </button>
      </div>
      <div className="flex gap-4 items-center relative">
        {/* Show full buttons on medium+ screens */}
        <div className="hidden sm:flex gap-4">
          <FooterButtons
            handleSave={handleSave}
            handleEdit={handleEdit}
            handleNew={handleNew}
            handleRaw={handleRaw}
            handleShare={handleShare}
            isEditor={isEditor}
          />
        </div>

        {/* 3 dots menu for mobile */}
        <div className="sm:hidden relative">
          <FooterButton
            id="more"
            shortcut={[]}
            onClick={() => setShowMenu(!showMenu)}
            icon={faEllipsisV}
            disabled={false}
          />
          {showMenu && (
            <div className="absolute bottom-12 right-0 bg-gray-800 text-white rounded shadow-md p-2 flex flex-col z-30 min-w-[150px]">
              <FooterInput
                target={false}
                title={title}
                value={title}
                isEditor={isEditor}
              />
              <hr />
              <FooterButtons
                handleSave={handleSave}
                handleEdit={handleEdit}
                handleNew={handleNew}
                handleRaw={handleRaw}
                handleShare={handleShare}
                isEditor={isEditor}
              />
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

function FooterButtons({
  handleSave,
  handleEdit,
  handleNew,
  handleRaw,
  handleShare,
  isEditor,
}: {
  handleSave: () => void;
  handleEdit: () => void;
  handleNew: () => void;
  handleRaw: () => void;
  handleShare: () => void;
  isEditor: boolean;
}) {
  return (
    <>
      <FooterButton
        id="new"
        shortcut={SHORTCUTS.NEW}
        onClick={handleNew}
        disabled={false}
        icon={faPlus}
      />
      <FooterButton
        id="save"
        shortcut={SHORTCUTS.SAVE}
        onClick={handleSave}
        disabled={!isEditor}
        icon={faFloppyDisk}
      />
      <FooterButton
        id="edit"
        shortcut={SHORTCUTS.EDIT}
        onClick={handleEdit}
        disabled={isEditor}
        icon={faEdit}
      />
      <FooterButton
        id="raw"
        shortcut={SHORTCUTS.RAW}
        onClick={handleRaw}
        disabled={isEditor}
        icon={faFile}
      />
      <FooterButton
        id="share"
        shortcut={SHORTCUTS.SHARE}
        onClick={handleShare}
        disabled={isEditor}
        icon={faShare}
      />
    </>
  );
}

// target true is when the input is in the footer, false is when it is in the mobile friendly actions button
function FooterInput({
  target,
  title,
  value,
  isEditor,
  onChange,
}: {
  target: boolean;
  title: string;
  value?: string;
  isEditor: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <input
        type="text"
        placeholder="Paste Title"
        value={value || ""}
        disabled={!isEditor}
        className={`bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:outline-none placeholder-gray-400 ${
          target ? "hidden sm:block" : ""
        } ${isEditor ? "" : "cursor-not-allowed"}`}
        onChange={onChange}
      />
    </>
  );
}

interface FooterButtonProps {
  id: string;
  shortcut: string[];
  onClick: () => void;
  disabled: boolean;
  icon: IconDefinition;
}

function FooterButton({
  id,
  shortcut,
  onClick,
  disabled,
  icon,
}: FooterButtonProps) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            id={`action-${id}`}
            className={`p-2 rounded hover:bg-gray-800 text-gray-300 ${
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={onClick}
            disabled={disabled}
          >
            <FontAwesomeIcon icon={icon} />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={6}
            className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md z-50"
          >
            {shortcut.join(" + ")}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
