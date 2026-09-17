"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Link2Off,
  Lock,
  MoreHorizontal,
  RefreshCw,
  Terminal,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { useExplorerstore } from "@/lib/store/Explorerstore";
import collectFiles from "@/lib/features";

export default function PreviewTab({ parentId }: { parentId: string }) {
  const folder = useExplorerstore((s) => s.cache[parentId]);

  if (!folder) {
    return <DisconnectedState />;
  }

  const sandBoxFile = collectFiles(folder);

  return (
    <SandpackProvider
      template="static"
      files={sandBoxFile}
      options={{
        autorun: true,
      }}
    >
      {/* <FilesSync files={sandBoxFile} /> */}
      <PreviewUI />
    </SandpackProvider>
  );
}

// SandpackProvider's `files` prop only sets the *initial* sandbox state —
// it doesn't re-sync on prop changes. This pushes every later change
// (new files arriving, HTML/CSS/JS edits) into the running sandbox.
function FilesSync({
  files,
}: {
  files: Record<string, { code: string } | string>;
}) {
  const { sandpack } = useSandpack();

  useEffect(() => {
    Object.entries(files).forEach(([path, file]) => {
      const code = typeof file === "string" ? file : file.code;
      const current = sandpack.files[path];
      const currentCode = typeof current === "string" ? current : current?.code;

      if (currentCode !== code) {
        sandpack.updateFile(path, code);
      }
    });
    // Only re-run when the collected file set actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  return null;
}

function PreviewUI() {
  const { sandpack } = useSandpack();
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Sandpack doesn't expose the running iframe's URL as a prop, and its
  // `status` values don't reliably settle on a fixed "ready" string across
  // versions — so watch the DOM directly for the iframe's src instead.
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const checkForIframe = () => {
      const iframe = container.querySelector("iframe");
      if (iframe?.src) {
        setPreviewUrl((prev) => (prev !== iframe.src ? iframe.src : prev));
      }
    };

    checkForIframe();

    const observer = new MutationObserver(checkForIframe);
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-full w-full min-h-0 flex-col overflow-hidden bg-[#181818]">
      {/* Header */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#cccccc]">Preview</span>

          <span className="flex items-center gap-1 text-[10px] text-[#858585]">
            <span className="size-1.5 rounded-full bg-green-500" />
            Running
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            title="Refresh Preview"
            className="size-7 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-white"
            onClick={() => sandpack.runSandpack()}
          >
            <RefreshCw className="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            title="Open in New Tab"
            className="size-7 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-white"
            disabled={!previewUrl}
            onClick={() => previewUrl && window.open(previewUrl, "_blank")}
          >
            <ExternalLink className="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            title="Disconnect Preview"
            className="size-7 rounded-sm text-[#858585] hover:bg-red-500/10 hover:text-red-400"
          >
            <Link2Off className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Browser bar */}
      <div className="flex h-10 shrink-0 items-center gap-1.5 border-b border-[#2d2d30] bg-[#1f1f1f] px-2">
        <Button
          variant="ghost"
          size="icon"
          disabled
          className="size-7 shrink-0 rounded-sm text-[#858585]"
        >
          <ArrowLeft className="size-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          disabled
          className="size-7 shrink-0 rounded-sm text-[#858585]"
        >
          <ArrowRight className="size-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          title="Reload"
          className="size-7 shrink-0 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-[#cccccc]"
          onClick={() => sandpack.runSandpack()}
        >
          <RefreshCw className="size-3.5" />
        </Button>

        <div className="flex h-7 min-w-0 flex-1 items-center gap-2 rounded-md border border-[#333333] bg-[#181818] px-2.5">
          <Lock className="size-3 shrink-0 text-[#666666]" />

          <span className="truncate text-xs text-[#858585]">
            {previewUrl || "preview/index.html"}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          title="More"
          className="size-7 shrink-0 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-[#cccccc]"
        >
          <MoreHorizontal className="size-3.5" />
        </Button>
      </div>

      {/* Preview */}
      <div
        ref={previewContainerRef}
        className="min-h-0 flex-1 overflow-hidden bg-white"
      >
        <SandpackLayout className="h-full">
          <SandpackPreview
            showOpenInCodeSandbox={false}
            showRefreshButton={false}
            style={{
              width: "100%",
              height: "100svh",
            }}
          />
        </SandpackLayout>
      </div>
    </div>
  );
}

function DisconnectedState() {
  return (
    <div className="flex min-h-0 h-full items-center justify-center bg-[#1e1e1e]">
      <div className="flex max-w-sm flex-col items-center px-6 text-center">
        <div
          className="
            mb-5 flex size-12 items-center justify-center
            rounded-full border border-[#333333]
            bg-[#252526]
          "
        >
          <Link2Off className="size-5 text-[#858585]" />
        </div>

        <h2 className="text-sm font-medium text-[#d4d4d4]">
          Preview disconnected
        </h2>

        <p className="mt-2 text-xs leading-5 text-[#858585]">
          The preview is currently disconnected.
          <br />
          Run the project to start it again.
        </p>

        <Button
          variant="none"
          className="
            mt-5 h-8 gap-2 rounded-md
            bg-[#007acc] px-3
            text-xs text-white
            hover:bg-[#006bb3]
          "
        >
          <Terminal className="size-3.5" />
          Run Project
        </Button>
      </div>
    </div>
  );
}
