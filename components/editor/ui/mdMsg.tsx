"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";

interface MarkdownMessageProps {
  content: string;
}

function CodeBlock({
  language,
  value,
}: {
  language: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="my-3 overflow-hidden rounded-sm border border-[#2d2d30] bg-[#1e1e1e]">
      <div className="flex h-7 items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-3 text-[11px] font-mono text-[#858585] select-none">
        <span className="text-[#cccccc] lowercase">{language || "text"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-[#858585] transition-colors hover:text-[#cccccc]"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="size-3 text-[#89d185]" />
              <span className="text-[#89d185]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto text-[12px] font-mono">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language || "text"}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: "10px 12px",
            background: "transparent",
            fontSize: "12px",
            lineHeight: "1.5",
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default function MdMsg({ content }: MarkdownMessageProps) {
  return (
    <div className="max-w-none text-xs leading-relaxed text-[#cccccc]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            return match ? (
              <CodeBlock language={match[1]} value={codeString} />
            ) : (
              <code
                className="rounded-sm bg-[#2d2d30] px-1.5 py-0.5 font-mono text-[11px] text-[#9cdcfe]"
                {...props}
              >
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0 text-[#cccccc] leading-relaxed">{children}</p>;
          },
          ul({ children }) {
            return <ul className="mb-2 list-disc pl-4 space-y-1 text-[#cccccc]">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="mb-2 list-decimal pl-4 space-y-1 text-[#cccccc]">{children}</ol>;
          },
          li({ children }) {
            return <li className="text-[#cccccc]">{children}</li>;
          },
          h1({ children }) {
            return <h1 className="mb-2 mt-3 text-sm font-semibold text-white">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="mb-1.5 mt-2.5 text-xs font-semibold text-white">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="mb-1 mt-2 text-xs font-medium text-white">{children}</h3>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-[#3794ff] hover:underline"
              >
                {children}
              </a>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-2 border-l-2 border-[#007acc] pl-3 italic text-[#858585]">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="my-2 overflow-x-auto">
                <table className="w-full border-collapse border border-[#2d2d30] text-left text-xs">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border border-[#2d2d30] bg-[#252526] px-2.5 py-1.5 font-semibold text-[#cccccc]">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-[#2d2d30] px-2.5 py-1.5 text-[#cccccc]">
                {children}
              </td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
