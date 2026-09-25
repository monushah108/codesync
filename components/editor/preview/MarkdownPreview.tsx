"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { BookOpen, Check, Copy, ExternalLink, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCodestore } from "@/lib/store/Codestore";
import { useExplorerstore } from "@/lib/store/Explorerstore";
import { useLayoutstore } from "@/lib/store/Layoutstore";
import { useCodeActions } from "@/lib/store/actions/useCodeAction";
import { isReadmeFileName, isMdFileName } from "@/lib/features";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";

interface MarkdownPreviewProps {
  parentId?: string;
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
      toast.success("Code copied to clipboard!");
    } catch {
      toast.error("Failed to copy code");
    }
  };

  return (
    <div className="my-4 overflow-hidden rounded-md border border-[#333333] bg-[#1e1e1e] shadow-md">
      <div className="flex h-8 items-center justify-between border-b border-[#333333] bg-[#252526] px-3.5 text-[11px] font-mono text-[#858585] select-none">
        <div className="flex items-center gap-1.5 text-[#cccccc]">
          <span className="size-2 rounded-full bg-[#007acc]/60" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            {language || "text"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-[#858585] transition-colors hover:text-white cursor-pointer px-1.5 py-0.5 rounded hover:bg-[#333333]"
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
      <div className="overflow-x-auto text-[13px] font-mono">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language || "text"}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: "14px 16px",
            background: "transparent",
            fontSize: "12.5px",
            lineHeight: "1.6",
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default function MarkdownPreview({ parentId }: MarkdownPreviewProps) {
  const params = useParams();
  const activeFileId = useCodestore((s) => s.activeFileId);
  const openFiles = useCodestore((s) => s.openFiles);
  const code = useCodestore((s) => s.code);
  const cache = useExplorerstore((s) => s.cache);
  const closePanel = useLayoutstore((s) => s.closePanel);

  const [copiedFile, setCopiedFile] = useState(false);

  const activeFile = openFiles.find((f) => f._id === activeFileId);

  // 1. Resolve Target File:
  // If active file is a README or markdown file, prioritize it so user sees live edits to the active file.
  // Otherwise, find a README in open files, or search cache.
  const targetFile = useMemo(() => {
    // If active file is any markdown file or readme, use it
    if (activeFile && (isReadmeFileName(activeFile.name) || isMdFileName(activeFile.name))) {
      return activeFile;
    }

    // Check open files for a README
    const openReadme = openFiles.find((f) => isReadmeFileName(f.name));
    if (openReadme) return openReadme;

    // Check cache for any README
    for (const folder of Object.values(cache)) {
      const readme = folder?.files?.find((f) => isReadmeFileName(f.name));
      if (readme) return readme;
    }

    // Fallback: any open markdown file
    const openMd = openFiles.find((f) => isMdFileName(f.name));
    if (openMd) return openMd;

    // Fallback: any markdown file in cache
    for (const folder of Object.values(cache)) {
      const md = folder?.files?.find((f) => isMdFileName(f.name));
      if (md) return md;
    }

    return undefined;
  }, [activeFile, openFiles, cache]);

  // Proactively fetch content if file exists in cache but hasn't been loaded into code yet
  useEffect(() => {
    if (
      targetFile?._id &&
      !code[targetFile._id]?.loaded &&
      !code[targetFile._id]?.loading &&
      (!targetFile.content || !targetFile.content.trim())
    ) {
      const roomId =
        (params?.roomId as string) ||
        (typeof window !== "undefined"
          ? window.location.pathname.split("/")[2]
          : "");
      if (roomId) {
        useCodeActions.loadFile(roomId, targetFile._id);
      }
    }
  }, [targetFile, code, params?.roomId]);

  const content = targetFile
    ? (code[targetFile._id]?.content ?? targetFile.content ?? "")
    : "";

  // Compute word and character count stats
  const stats = useMemo(() => {
    const text = content.trim();
    if (!text) return { words: 0, chars: 0, readTime: "0 min" };
    const words = text.split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return {
      words,
      chars,
      readTime: `${minutes} min read`,
    };
  }, [content]);

  const handleCopyMarkdown = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
      toast.success("Markdown copied to clipboard!");
    } catch {
      toast.error("Failed to copy markdown");
    }
  };

  return (
    <div className="flex h-full w-full min-h-0 min-w-0 max-w-full flex-col overflow-hidden bg-[#181818] select-text">
      {/* Top Header Bar */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-3 text-xs select-none">
        <div className="flex items-center gap-2 min-w-0">
          <Icon
            icon="vscode-icons:file-type-markdown"
            width={16}
            height={16}
            className="shrink-0"
          />
          <span className="font-semibold text-white truncate text-xs">
            {targetFile?.name || "README.md"}
          </span>
          <span className="rounded bg-[#1e1e1e] border border-[#333333] px-1.5 py-0.2 text-[10px] text-[#858585] hidden sm:inline">
            Preview
          </span>
          {stats.words > 0 && (
            <span className="text-[10px] text-[#707070] hidden md:inline">
              ({stats.words} words • {stats.readTime})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Copy Markdown Content */}
          {content.trim() && (
            <Button
              variant="ghost"
              size="icon"
              title="Copy markdown content"
              className="size-7 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-white"
              onClick={handleCopyMarkdown}
            >
              {copiedFile ? (
                <Check className="size-3.5 text-[#89d185]" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </Button>
          )}

          {/* Close Preview */}
          <Button
            variant="ghost"
            size="icon"
            title="Close Preview"
            className="size-7 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-white"
            onClick={() => closePanel("preview")}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Markdown Content Area */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-[#1e1e1e] px-4 py-6 sm:px-8 sm:py-8">
        {content.trim() ? (
          <div className="max-w-3xl mx-auto font-sans">
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
                      className="rounded-md bg-[#252526] border border-[#3c3c3c] px-1.5 py-0.5 font-mono text-[12px] text-[#9cdcfe]"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                h1({ children }) {
                  return (
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight pb-3 mb-5 border-b border-[#333333] flex items-center gap-2">
                      {children}
                    </h1>
                  );
                },
                h2({ children }) {
                  return (
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pb-2 mb-4 mt-8 border-b border-[#333333]">
                      {children}
                    </h2>
                  );
                },
                h3({ children }) {
                  return (
                    <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight mb-3 mt-6">
                      {children}
                    </h3>
                  );
                },
                h4({ children }) {
                  return (
                    <h4 className="text-sm font-semibold text-[#e1e4e8] mb-2 mt-5">
                      {children}
                    </h4>
                  );
                },
                p({ children }) {
                  return (
                    <p className="text-[13px] sm:text-sm text-[#d4d4d4] leading-7 mb-4">
                      {children}
                    </p>
                  );
                },
                ul({ children }) {
                  return (
                    <ul className="list-disc pl-6 space-y-1.5 text-[13px] sm:text-sm text-[#d4d4d4] mb-4">
                      {children}
                    </ul>
                  );
                },
                ol({ children }) {
                  return (
                    <ol className="list-decimal pl-6 space-y-1.5 text-[13px] sm:text-sm text-[#d4d4d4] mb-4">
                      {children}
                    </ol>
                  );
                },
                li({ children }) {
                  return <li className="leading-7">{children}</li>;
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#3794ff] hover:underline hover:text-[#5eaaff] font-medium inline-flex items-center gap-0.5 transition-colors"
                    >
                      <span>{children}</span>
                      <ExternalLink className="size-3 opacity-60 inline" />
                    </a>
                  );
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="my-4 border-l-4 border-[#007acc] bg-[#252526]/60 rounded-r-md px-4 py-3 text-[13px] text-[#9d9d9d] italic leading-relaxed">
                      {children}
                    </blockquote>
                  );
                },
                hr() {
                  return <hr className="my-6 border-[#333333]" />;
                },
                table({ children }) {
                  return (
                    <div className="my-4 overflow-x-auto rounded-md border border-[#333333]">
                      <table className="w-full border-collapse text-left text-xs sm:text-[13px]">
                        {children}
                      </table>
                    </div>
                  );
                },
                th({ children }) {
                  return (
                    <th className="border-b border-[#333333] bg-[#252526] px-3.5 py-2.5 font-semibold text-white">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td className="border-b border-[#2d2d30] px-3.5 py-2.5 text-[#cccccc]">
                      {children}
                    </td>
                  );
                },
                img({ src, alt }) {
                  if (!src || typeof src !== "string" || !src.trim()) {
                    return null;
                  }
                  return (
                    <img
                      src={src}
                      alt={alt || "Image"}
                      className="max-w-full h-auto rounded-md border border-[#333333] my-4 shadow-md inline-block"
                      loading="lazy"
                    />
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex h-full min-h-[250px] flex-col items-center justify-center text-center text-[#858585] select-none p-6">
            <div className="flex size-14 items-center justify-center rounded-full border border-[#333333] bg-[#252526] mb-4">
              <BookOpen className="size-7 text-[#555555]" />
            </div>
            <h3 className="text-sm font-medium text-[#cccccc] mb-1">
              {targetFile ? `${targetFile.name} is empty` : "No README found"}
            </h3>
            <p className="text-xs text-[#858585] max-w-xs leading-relaxed">
              {targetFile
                ? "Start typing markdown in the editor to see your live preview here."
                : "Add a README.md file in the file explorer to preview documentation."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
