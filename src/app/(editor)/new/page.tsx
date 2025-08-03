"use client";

import { useState, useRef, useEffect } from "react";
import EditorFooter from "@/components/EditorFooter";
import hljs from "highlight.js";
import Swal from "sweetalert2";
import { getPaste } from "@/utils/editor-commons";
import "@fontsource/jetbrains-mono/400.css";
import { createPaste } from "@/lib/api/paste";
import { APP_CONFIG } from "../../../../app.config";

export default function HomePage() {
  const [content, setContent] = useState(``);
  const [language, setLanguage] = useState("");
  const [title, setTitle] = useState("");
  const [isAutoDetect, setIsAutoDetect] = useState(true);
  const [isPublic, setPublic] = useState(true);
  const linenosRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync scroll between textarea and linenos
  const handleScroll = () => {
    if (textareaRef.current && linenosRef.current) {
      linenosRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token") ?? undefined;

      const paste = await createPaste({
        title,
        content,
        public: isPublic,
        token,
      });

      window.location.href = `/${paste.id}`;

      // Optional: redirect or update UI with paste.id
      // e.g., router.push(`/pastes/${paste.id}`);
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error saving paste",
        text: error.message || "Something went wrong.",
      });
    }
  };

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (textareaRef.current && linenosRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      linenosRef.current.scrollTop = linenosRef.current.scrollHeight;
    }
  }, [content]);

  // Auto-detect language on content change only if language is set to auto (empty string)
  useEffect(() => {
    if (!isAutoDetect || !textareaRef.current) return;

    const codeText = textareaRef.current.value;
    const result = hljs.highlightAuto(codeText);

    if (result.language) {
      setLanguage(result.language);
    } else {
      setLanguage("");
    }
  }, [content, isAutoDetect]);

  // Handle edit sessions
  useEffect(() => {
    const fetchPaste = async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("edit");
      if (id) {
        try {
          const data = await getPaste(id as string);
          setContent(data.content || "");

          // todo: add language and title
        } catch (err: any) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.message || "Failed to load paste.",
          });
          setContent(`// Error loading paste '${id}': ${err.message}`);
        }
      } else {
        // Default readme
        const data = await getPaste(APP_CONFIG.WELCOME_DOCUMENT);
        setContent(data.content);
      }
    };
    fetchPaste();
  }, []);

  return (
    <>
      <div
        className="flex flex-1 w-full overflow-hidden pb-4"
        style={{ height: "calc(100vh - 48px)" }}
      >
        <div
          ref={linenosRef}
          className="top-5 left-0 pr-5 select-none text-sm overflow-auto h-full text-gray-500"
          style={{ minWidth: 32, scrollbarWidth: "none" }}
        >
          {Array.from({ length: content.split("\n").length }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <TextArea
          content={content}
          onChange={setContent}
          textareaRef={textareaRef}
          onScroll={handleScroll}
        />
      </div>

      <EditorFooter
        language={language}
        setLanguage={setLanguage}
        setTitle={setTitle}
        setIsAutoDetect={setIsAutoDetect}
        setPublic={setPublic}
        isPublic={isPublic}
        title={title}
        isEditor={true}
        handleSave={handleSave}
        handleEdit={() => {}}
      />
    </>
  );
}

function TextArea({
  content,
  onChange,
  textareaRef,
  onScroll,
}: {
  content: string;
  onChange: (val: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onScroll: () => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault(); // Prevent focus change
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      const newValue =
        value.substring(0, start) + "    " + value.substring(end); // 4 spaces
      onChange(newValue);

      // Move the cursor
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <textarea
      ref={textareaRef}
      className="flex-1 h-full w-full resize-none bg-transparent text-white text-sm outline-none border-none overflow-y-auto"
      value={content}
      wrap="off"
      placeholder="Write your code here..."
      onChange={(e) => onChange(e.target.value)}
      onScroll={onScroll}
      onKeyDown={handleKeyDown}
      spellCheck={false}
      style={{
        fontFamily: "JetBrains Mono",
      }}
    />
  );
}
