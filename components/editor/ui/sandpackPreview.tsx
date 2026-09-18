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
  Terminal,
  Trash2,
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

const CONSOLE_SHIM_PATH = "/__sandbox-console.js";

const CONSOLE_SHIM_CODE = `(function () {
  function serialize(arg) {
    if (typeof arg === "string") return arg;

    if (arg instanceof Error) {
      return arg.stack || arg.message;
    }

    try {
      return JSON.stringify(arg, null, 2);
    } catch (e) {
      return String(arg);
    }
  }

  function forward(method, args) {
    try {
      window.parent.postMessage(
        {
          source: "sandbox-console",
          method: method,
          args: args.map(serialize),
        },
        "*"
      );
    } catch (e) {}
  }

  ["log", "info", "warn", "error"].forEach(function (method) {
    var original = console[method];

    console[method] = function () {
      forward(method, Array.prototype.slice.call(arguments));
      original.apply(console, arguments);
    };
  });

  window.addEventListener("error", function (event) {
    forward("error", [
      event.message +
        " (" +
        event.filename +
        ":" +
        event.lineno +
        ")",
    ]);
  });

  window.addEventListener("unhandledrejection", function (event) {
    forward("error", [
      "Unhandled promise rejection: " +
        serialize(event.reason),
    ]);
  });
})();
`;

function withConsoleShim(files: SandpackFiles): SandpackFiles {
  const html = files["/index.html"];

  // No index.html → don't inject anything.
  if (!html) return files;

  const scriptTag = `<script src="${CONSOLE_SHIM_PATH}"></script>`;

  const alreadyInjected = html.code.includes(CONSOLE_SHIM_PATH);

  const nextHtml = alreadyInjected
    ? html.code
    : html.code.includes("</head>")
      ? html.code.replace("</head>", `  ${scriptTag}\n</head>`)
      : `${scriptTag}\n${html.code}`;

  return {
    ...files,

    "/index.html": {
      ...html,
      code: nextHtml,
    },

    [CONSOLE_SHIM_PATH]: {
      code: CONSOLE_SHIM_CODE,
      fileId: "__sandbox-console",
    },
  };
}

type ConsoleEntry = {
  id: string;
  method: "log" | "info" | "warn" | "error";
  text: string;
};

function useSandboxConsole() {
  const [logs, setLogs] = useState<ConsoleEntry[]>([]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data;

      if (!data || data.source !== "sandbox-console") {
        return;
      }

      setLogs((prev) => {
        const next: ConsoleEntry[] = [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            method: data.method,
            text: Array.isArray(data.args)
              ? data.args.join(" ")
              : String(data.args),
          },
        ];

        return next.length > 300 ? next.slice(next.length - 300) : next;
      });
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const clear = () => {
    setLogs([]);
  };

  return {
    logs,
    clear,
  };
}

export default function SandpackPreview({ parentId }: { parentId: string }) {
  const [connected, setConnected] = useState(true);

  const code = useCodestore((s) => s.code);

  const folder = useExplorerstore((s) => s.cache[parentId]);

  const cache = useExplorerstore((s) => s.cache);

  /*
   * Build the complete virtual filesystem.
   */
  const virtualFiles = useMemo(() => {
    return collectFiles(cache, parentId, code);
  }, [cache, parentId, code]);

  /*
   * Check the ENTIRE virtual filesystem.
   *
   * Examples that return true:
   *
   * /index.html
   * /about.html
   * /src/pages/home.html
   * /public/test.HTML
   */
  const hasHtmlFile = useMemo(() => {
    return Object.keys(virtualFiles).some((path) =>
      path.toLowerCase().endsWith(".html"),
    );
  }, [virtualFiles]);

  /*
   * Only inject the console shim when preview
   * is actually possible.
   */
  const sandBoxFiles = useMemo(() => {
    if (!hasHtmlFile) {
      return virtualFiles;
    }

    return withConsoleShim(virtualFiles);
  }, [virtualFiles, hasHtmlFile]);

  /*
   * No HTML anywhere in the virtual filesystem.
   *
   * Therefore there is nothing that the static
   * Sandpack preview can render.
   */
  if (!folder || !connected || !hasHtmlFile) {
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

  const [showConsole, setShowConsole] = useState(false);

  const { logs, clear } = useSandboxConsole();

  const handleRefresh = () => {
    clear();
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
          {/* Console */}

          <Button
            variant="ghost"
            size="icon"
            title={showConsole ? "Hide Console" : "Show Console"}
            className={`size-7 rounded-sm hover:bg-[#333333] hover:text-white ${
              showConsole ? "bg-[#333333] text-white" : "text-[#858585]"
            }`}
            onClick={() => setShowConsole((prev) => !prev)}
          >
            <Terminal className="size-3.5" />
          </Button>

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

      {/* Preview + Console */}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Preview */}

        <div
          className={`min-h-0 overflow-hidden bg-white ${
            showConsole ? "flex-1" : "h-full flex-1"
          }`}
        >
          <SandpackLayout className="h-full min-h-0">
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

        {/* Console */}

        {showConsole && (
          <div className="flex h-48 shrink-0 flex-col overflow-hidden border-t border-[#2d2d30] bg-[#181818]">
            <div className="flex h-7 shrink-0 items-center justify-between border-b border-[#2d2d30] px-2">
              <span className="text-[10px] uppercase tracking-wide text-[#858585]">
                Console
              </span>

              <Button
                variant="ghost"
                size="icon"
                title="Clear console"
                className="size-6 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-white"
                onClick={clear}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-1 font-mono text-[11px] leading-5">
              {logs.length === 0 ? (
                <div className="text-[#555555]">
                  No output yet — logs from your code will appear here.
                </div>
              ) : (
                logs.map((entry) => (
                  <div
                    key={entry.id}
                    className={
                      entry.method === "error"
                        ? "text-red-400"
                        : entry.method === "warn"
                          ? "text-yellow-400"
                          : "text-[#cccccc]"
                    }
                  >
                    {entry.text}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
