"use client";

import { useEffect, useMemo, useState } from "react";

import {
  SandpackLayout,
  SandpackPreview as SandpackPreviewComponent,
  SandpackProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";

import {
  ArrowLeft,
  ArrowRight,
  Link2Off,
  Lock,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useCodestore } from "@/lib/store/Codestore";
import { useExplorerstore } from "@/lib/store/Explorerstore";
import collectFiles from "@/lib/features";

import DisconnectedState from "./disconnectStatus";

type SandpackFile = {
  code: string;
  fileId: string;
};

type SandpackFiles = Record<string, SandpackFile>;

export default function SandpackPreview({ parentId }: { parentId: string }) {
  const [connected, setConnected] = useState(true);

  const code = useCodestore((s) => s.code);

  const folder = useExplorerstore((s) => s.cache[parentId]);

  const cache = useExplorerstore((s) => s.cache);

  const sandBoxFiles = useMemo(() => {
    return collectFiles(cache, parentId, code);
  }, [cache, parentId, code]);

  if (!folder || !connected) {
    return <DisconnectedState onRun={() => setConnected(true)} />;
  }

  return (
    <SandpackProvider
      template="static"
      files={sandBoxFiles}
      options={{
        autorun: true,
      }}
    >
      <SandpackFilesSync files={sandBoxFiles} />

      <PreviewUI onDisconnect={() => setConnected(false)} />
    </SandpackProvider>
  );
}

function SandpackFilesSync({ files }: { files: SandpackFiles }) {
  const { sandpack } = useSandpack();

  useEffect(() => {
    for (const [path, file] of Object.entries(files)) {
      const current = sandpack.files[path];

      const currentCode =
        typeof current === "string" ? current : (current?.code ?? "");

      if (currentCode !== file.code) {
        sandpack.updateFile(path, file.code);
      }
    }
  }, [files, sandpack]);

  return null;
}

function PreviewUI({ onDisconnect }: { onDisconnect: () => void }) {
  const { sandpack } = useSandpack();

  const handleRefresh = () => {
    sandpack.runSandpack();
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#181818]">
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
          {/* Refresh */}

          <Button
            variant="ghost"
            size="icon"
            title="Refresh Preview"
            className="size-7 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-white"
            onClick={handleRefresh}
          >
            <RefreshCw className="size-3.5" />
          </Button>

          {/* Disconnect */}

          <Button
            variant="ghost"
            size="icon"
            title="Disconnect Preview"
            className="size-7 rounded-sm text-[#858585] hover:bg-red-500/10 hover:text-red-400"
            onClick={onDisconnect}
          >
            <Link2Off className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Browser Bar */}

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
          onClick={handleRefresh}
        >
          <RefreshCw className="size-3.5" />
        </Button>

        <div className="flex h-7 min-w-0 flex-1 items-center gap-2 rounded-md border border-[#333333] bg-[#181818] px-2.5">
          <Lock className="size-3 shrink-0 text-[#666666]" />

          <span className="truncate text-xs text-[#858585]">
            preview/index.html
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

      <div className="min-h-0 flex-1 overflow-hidden bg-white">
        <SandpackLayout className="h-full">
          <SandpackPreviewComponent
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
