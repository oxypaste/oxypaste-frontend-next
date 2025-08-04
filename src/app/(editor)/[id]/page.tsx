"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import hljs from "highlight.js";
import "@catppuccin/highlightjs/css/catppuccin-mocha.css";
import EditorFooter from "@/components/EditorFooter";
import { getPaste } from "@/lib/api/paste";
import Swal from "sweetalert2";
import "@fontsource/jetbrains-mono/400.css";
import { Language } from "@/lib/models/paste.model";
import { toLanguageEnum } from "@/utils/editor-commons";
import {
  Description,
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  faCheckCircle,
  faCopy,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PastePage() {
  const { id } = useParams();

  const [isAutoDetect, setIsAutoDetect] = useState(true);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState<Language>(Language.AutoDetect);
  const [content, setContent] = useState("");
  const [isPublic, setPublic] = useState(true);

  const linenosRef = useRef<HTMLDivElement>(null);
  const codeElementRef = useRef<HTMLElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState<"success" | "error" | null>(
    null
  );

  const handleShare = () => {
    setIsModalOpen(true);
  };

  const confirmCopy = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess("success");
    } catch {
      setCopySuccess("error");
    } finally {
      setTimeout(() => {
        setIsModalOpen(false);
        setCopySuccess(null);
      }, 1500);
    }
  };

  useEffect(() => {
    async function fetchPaste() {
      if (id) {
        try {
          const data = await getPaste(id as string);
          setContent(data.content || "");
          setTitle(data.title);
          setPublic(data.public);

          if (data.language) setIsAutoDetect(false);
          setLanguage(data.language);
        } catch (err: any) {
          Swal.fire({
            icon: "error",
            title: "Error loading paste",
            text: err.message,
          });
          setContent(`// Error loading paste: ${err.message}`);
        }
      }
    }
    fetchPaste();
  }, [id]);

  // Scroll sync
  useEffect(() => {
    const linenos = linenosRef.current;
    const code = codeElementRef.current;

    if (!linenos || !code) return;

    const handleScroll = () => {
      linenos.scrollTop = code.scrollTop;
    };

    code.addEventListener("scroll", handleScroll);
    return () => {
      code.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="flex flex-auto w-full" tabIndex={0}>
        <div
          ref={linenosRef}
          className="select-none overflow-auto h-full min-w-fit text-gray-700 pb-14 pr-5 text-xs"
          style={{
            pointerEvents: "none",
            userSelect: "none",
            scrollbarWidth: "none",
          }}
        >
          {Array.from({ length: content.split("\n").length }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <CodeBlock
          language={language}
          content={content}
          codeRef={codeElementRef}
        />
      </div>
      <EditorFooter
        language={language}
        setLanguage={setLanguage}
        title={title}
        setTitle={setTitle}
        setIsAutoDetect={setIsAutoDetect}
        setPublic={setPublic}
        isPublic={isPublic}
        isEditor={false}
        handleSave={() => {}}
        handleEdit={() => {
          window.location.href = `/new?edit=${id}`;
        }}
        handleShare={handleShare}
      />

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalOpen(false)}
        >
          {/* Overlay */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              aria-hidden="true"
            />
          </TransitionChild>

          {/* Modal Panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-zinc-900 p-6 shadow-xl transition-all"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
              >
                {/* Title */}
                <DialogTitle
                  id="modal-title"
                  className="text-xl font-semibold text-gray-900 dark:text-white"
                >
                  Share This Paste?
                </DialogTitle>

                {/* Link Description */}
                <div
                  id="modal-description"
                  className="mt-2 text-sm text-gray-600 dark:text-gray-300 break-words"
                >
                  {typeof window !== "undefined"
                    ? window.location.href
                    : "Loading link..."}
                </div>

                {/* Action Buttons */}
                {copySuccess === null && (
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="cursor-pointer px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmCopy}
                      className="cursor-pointer px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                      Copy Link
                    </button>
                  </div>
                )}

                {/* Copy Result Messages */}
                {copySuccess === "success" && (
                  <div className="mt-6 flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Link copied to clipboard!
                  </div>
                )}
                {copySuccess === "error" && (
                  <div className="mt-6 flex items-center gap-2 text-red-600 dark:text-red-400 font-medium">
                    <FontAwesomeIcon icon={faTimesCircle} />
                    Failed to copy link. Try manually.
                  </div>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

function CodeBlock({
  language,
  content,
  codeRef,
}: {
  language: string;
  content: string;
  codeRef: React.RefObject<HTMLElement | null>;
}) {
  const highlighted = hljs.getLanguage(language)
    ? hljs.highlight(content, { language }).value
    : hljs.highlightAuto(content).value;

  return (
    <pre className="flex flex-auto h-full w-full text-xs pb-14">
      <code
        ref={codeRef}
        className="w-full overflow-auto"
        style={{
          display: "block",
          height: "100%",
          fontFamily: "JetBrains Mono",
        }}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  );
}
