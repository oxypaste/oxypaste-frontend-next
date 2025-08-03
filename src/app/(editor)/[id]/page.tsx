"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import hljs from "highlight.js";
import "@catppuccin/highlightjs/css/catppuccin-mocha.css";
import EditorFooter from "@/components/EditorFooter";
import { getPaste } from "@/lib/api/paste";
import Swal from "sweetalert2";
import "@fontsource/jetbrains-mono/400.css";

export default function PastePage() {
  const { id } = useParams();

  const [isAutoDetect, setIsAutoDetect] = useState(true);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [content, setContent] = useState("");

  const linenosRef = useRef<HTMLDivElement>(null);
  const codeElementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function fetchPaste() {
      if (id) {
        try {
          const data = await getPaste(id as string);
          setContent(data.content || "");
          // todo: fix language and title
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
        isEditor={false}
        handleSave={() => {}}
        handleEdit={() => {
          window.location.href = `/?edit=${id}`;
        }}
      />
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
