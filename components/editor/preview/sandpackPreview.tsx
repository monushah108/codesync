"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  SandpackPreview as SandpackPreviewComponent,
  SandpackProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";

import { useCodestore } from "@/lib/store/Codestore";
import { useExplorerstore } from "@/lib/store/Explorerstore";
import {
  collectVirtualFileSystem,
  SandpackFile,
  VirtualFileSystem,
} from "@/lib/features";

import DisconnectedState from "../ui/disconnectStatus";
import PreviewUI from "./previewUi";
import { Globe } from "lucide-react";

type SandpackFiles = Record<string, SandpackFile>;

const CONSOLE_SHIM_PATH = "/__sandbox-console.js";

const CONSOLE_SHIM_CODE = `(function () {
  function getParentOrigin() {
    try {
      if (document.referrer) {
        var origin = new URL(document.referrer).origin;
        if (origin && origin !== "null") return origin;
      }
    } catch (e) {}
    return "*";
  }

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
        getParentOrigin()
      );
    } catch (e) {}
  }

  // --- Infinite Loop Protection Runtime ---
  window.__loops = {};
  window.__protectLoop = function (loopId, timeout) {
    timeout = timeout || 1500;
    if (!window.__loops[loopId]) {
      window.__loops[loopId] = { start: Date.now(), count: 0 };
    }
    var entry = window.__loops[loopId];
    if ((++entry.count & 1023) === 0) {
      if (Date.now() - entry.start > timeout) {
        delete window.__loops[loopId];
        var msg = "Infinite loop detected (> " + timeout + "ms). Execution safely terminated to prevent browser freeze.";
        forward("error", [msg]);
        return true;
      }
    }
    return false;
  };

  var STRINGS_AND_COMMENTS = /("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|\`(?:[^\`\\\\]|\\\\.)*\`|\\\/\\\/[^\\n]*|\\\/\\*[\\s\\S]*?\\*\\\/)/g;
  function protectCodeLoops(code) {
    if (!code || typeof code !== "string") return code;
    var loopCounter = 0;
    var parts = code.split(STRINGS_AND_COMMENTS);
    for (var i = 0; i < parts.length; i += 2) {
      var chunk = parts[i];
      chunk = chunk.replace(
        /\\b(for|while)\\s*\\(([^{}()]*?(?:\\([^{}()]*?\\)[^{}()]*?)*)\\)\\s*(?:\\{|([^{;\\r\\n]+;?))/g,
        function(match, kw, cond, stmt) {
          var loopId = ++loopCounter;
          if (stmt !== undefined && stmt.trim().length > 0) {
            return kw + " (" + cond + ") { if (window.__protectLoop && window.__protectLoop(" + loopId + ")) break; " + stmt + " }";
          } else {
            return kw + " (" + cond + ") { if (window.__protectLoop && window.__protectLoop(" + loopId + ")) break; ";
          }
        }
      ).replace(
        /\\bdo\\s*\\{/g,
        function() {
          var loopId = ++loopCounter;
          return "do { if (window.__protectLoop && window.__protectLoop(" + loopId + ")) break; ";
        }
      );
      parts[i] = chunk;
    }
    return parts.join("");
  }

  ["log", "info", "warn", "error"].forEach(function (method) {
    var original = console[method];
    console[method] = function () {
      forward(method, Array.prototype.slice.call(arguments));
      if (original) original.apply(console, arguments);
    };
  });

  window.addEventListener("error", function (event) {
    forward("error", [
      event.message + " (" + (event.filename || "inline") + ":" + event.lineno + ")"
    ]);
  });

  window.addEventListener("unhandledrejection", function (event) {
    forward("error", [
      "Unhandled promise rejection: " + serialize(event.reason)
    ]);
  });

  // Interactive sandbox command evaluator (protected against infinite loops)
  window.addEventListener("message", function (event) {
    if (event.source !== window.parent) return;
    var data = event.data;
    if (!data || data.source !== "sandbox-eval-request") return;

    var targetOrigin = getParentOrigin();
    var safeCode = protectCodeLoops(data.code);

    try {
      var fn = new Function("return (" + safeCode + ")");
      var result = fn();
      window.parent.postMessage(
        {
          source: "sandbox-eval-result",
          id: data.id,
          success: true,
          result: serialize(result),
        },
        targetOrigin
      );
    } catch (err) {
      try {
        var execFn = new Function(safeCode);
        var execResult = execFn();
        window.parent.postMessage(
          {
            source: "sandbox-eval-result",
            id: data.id,
            success: true,
            result: serialize(execResult),
          },
          targetOrigin
        );
      } catch (execErr) {
        window.parent.postMessage(
          {
            source: "sandbox-eval-result",
            id: data.id,
            success: false,
            error: execErr instanceof Error ? (execErr.stack || execErr.message) : String(execErr),
          },
          targetOrigin
        );
      }
    }
  });
})();
`;

const STRINGS_AND_COMMENTS_REGEX = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;

/**
 * Instruments loops (for, while, do-while) with non-blocking guards
 * to prevent browser tab lockups from infinite loops.
 */
export function protectCodeLoops(code: string): string {
  if (!code || typeof code !== "string") return code;
  let loopCounter = 0;

  const parts = code.split(STRINGS_AND_COMMENTS_REGEX);

  for (let i = 0; i < parts.length; i += 2) {
    let chunk = parts[i];

    chunk = chunk.replace(
      /\b(for|while)\s*\(([^{}()]*?(?:\([^{}()]*?\)[^{}()]*?)*)\)\s*(?:\{|([^{;\r\n]+;?))/g,
      (match, kw, cond, stmt) => {
        const loopId = ++loopCounter;
        if (stmt !== undefined && stmt.trim().length > 0) {
          return `${kw} (${cond}) { if (window.__protectLoop && window.__protectLoop(${loopId})) break; ${stmt} }`;
        } else {
          return `${kw} (${cond}) { if (window.__protectLoop && window.__protectLoop(${loopId})) break; `;
        }
      }
    ).replace(
      /\bdo\s*\{/g,
      () => {
        const loopId = ++loopCounter;
        return `do { if (window.__protectLoop && window.__protectLoop(${loopId})) break; `;
      }
    );

    parts[i] = chunk;
  }

  return parts.join("");
}

export function protectHtmlScripts(html: string): string {
  return html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (match, attrs, scriptBody) => {
    if (/\bsrc\s*=/i.test(attrs) || /type\s*=\s*["']application\/json["']/i.test(attrs)) {
      return match;
    }
    const protectedBody = protectCodeLoops(scriptBody);
    return `<script${attrs}>${protectedBody}</script>`;
  });
}

function withConsoleShim(files: SandpackFiles): SandpackFiles {
  const result: SandpackFiles = { ...files };
  const scriptTag = `<script src="${CONSOLE_SHIM_PATH}"></script>`;

  for (const [path, file] of Object.entries(files)) {
    const lower = path.toLowerCase();
    if (lower.endsWith(".html")) {
      const alreadyInjected = file.code.includes(CONSOLE_SHIM_PATH);
      let nextHtml = alreadyInjected
        ? file.code
        : file.code.includes("</head>")
          ? file.code.replace("</head>", `  ${scriptTag}\n</head>`)
          : `${scriptTag}\n${file.code}`;

      nextHtml = protectHtmlScripts(nextHtml);

      result[path] = {
        ...file,
        code: nextHtml,
      };
    } else if (
      lower.endsWith(".js") ||
      lower.endsWith(".jsx") ||
      lower.endsWith(".ts") ||
      lower.endsWith(".tsx") ||
      lower.endsWith(".mjs")
    ) {
      if (!path.startsWith("/__")) {
        result[path] = {
          ...file,
          code: protectCodeLoops(file.code),
        };
      }
    }
  }

  result[CONSOLE_SHIM_PATH] = {
    code: CONSOLE_SHIM_CODE,
    fileId: "__sandbox-console",
  };

  return result;
}

type ConsoleEntry = {
  id: string;
  method: "log" | "info" | "warn" | "error";
  text: string;
  timestamp: string;
};

/**
 * Validates whether a window MessageEvent originates from a trusted Sandpack sandbox or our app.
 */
export function isTrustedSandboxOrigin(event: MessageEvent): boolean {
  if (typeof window !== "undefined" && event.origin === window.location.origin) {
    return true;
  }

  const ALLOWED_ORIGIN_REGEX = /^https:\/\/([a-zA-Z0-9_-]+\.)*(codesandbox\.io|csb\.app|sandpack\.io)$/;
  if (ALLOWED_ORIGIN_REGEX.test(event.origin)) {
    return true;
  }

  // Fallback: verify that the message sender is an iframe element mounted in our document
  if (typeof document !== "undefined" && event.source) {
    const iframes = document.querySelectorAll("iframe");
    for (let i = 0; i < iframes.length; i++) {
      if (iframes[i].contentWindow === event.source) {
        return true;
      }
    }
  }

  return false;
}

export function useSandboxConsole() {
  const [logs, setLogs] = useState<ConsoleEntry[]>([]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!isTrustedSandboxOrigin(event)) return;

      const data = event.data;
      if (!data || data.source !== "sandbox-console") return;

      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setLogs((prev) => {
        const next: ConsoleEntry[] = [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            method: data.method,
            text: Array.isArray(data.args) ? data.args.join(" ") : String(data.args),
            timestamp: time,
          },
        ];
        return next.length > 500 ? next.slice(next.length - 500) : next;
      });
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const clear = () => setLogs([]);

  return { logs, clear };
}

export default function SandpackPreview({ parentId }: { parentId: string }) {
  const [connected, setConnected] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const code = useCodestore((s) => s.code);
  const folder = useExplorerstore((s) => s.cache[parentId]);
  const cache = useExplorerstore((s) => s.cache);

  // Upgraded Virtual File System analysis & extraction
  const vfs: VirtualFileSystem = useMemo(() => {
    return collectVirtualFileSystem(cache, parentId, code);
  }, [cache, parentId, code]);

  const sandBoxFiles = useMemo(() => {
    return withConsoleShim(vfs.files);
  }, [vfs]);

  // Handle ESC key to exit full screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen]);

  if (!connected) {
    return (
      <div className="flex h-full w-full min-h-0 flex-col overflow-hidden bg-[#181818]">
        <DisconnectedState onRun={() => setConnected(true)} />
      </div>
    );
  }

  if (!vfs.hasHtmlFile) {
    return (
      <div className="flex h-full w-full min-h-0 flex-col items-center justify-center p-6 text-center select-none bg-[#181818]">
        <div className="flex size-12 items-center justify-center rounded-full border border-[#333333] bg-[#252526] mb-4">
          <Globe className="size-6 text-[#858585]" />
        </div>
        <h3 className="text-sm font-medium text-[#cccccc] mb-1">Live Preview</h3>
        <p className="text-xs text-[#858585] max-w-xs leading-relaxed">
          No <code className="px-1.5 py-0.5 rounded bg-[#252526] text-[#3794ff]">index.html</code> found in workspace.
          Create an <code className="px-1.5 py-0.5 rounded bg-[#252526] text-[#3794ff]">index.html</code> file to see your live website preview.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-0 flex flex-col overflow-hidden bg-[#181818] transition-all duration-200 ${isFullScreen
        ? "fixed inset-0 z-50 h-screen w-screen"
        : "h-full w-full flex-1"
        }`}
    >
      {/* Global CSS overrides to make Sandpack cleanly cover full height and not block resizing */}
      <style>{`
        .sandpack-full-height,
        .sandpack-full-height .sp-wrapper,
        .sandpack-full-height .sp-layout,
        .sandpack-full-height .sp-stack {
          height: 100% !important;
          width: 100% !important;
          max-height: 100% !important;
          min-height: 0 !important;
          min-width: 0 !important;
          max-width: 100% !important;
          border: none !important;
          border-radius: 0 !important;
          overflow: hidden !important;
        }
        .sandpack-full-height .sp-preview,
        .sandpack-full-height .sp-preview-container,
        .sandpack-full-height .sp-preview-iframe {
          height: 100% !important;
          width: 100% !important;
          min-height: 0 !important;
          min-width: 0 !important;
          max-width: 100% !important;
          flex: 1 1 0% !important;
          border: none !important;
          overflow: hidden !important;
        }
        body[data-resizing="true"] .sp-preview-iframe,
        body[data-resizing="true"] iframe {
          pointer-events: none !important;
        }
      `}</style>

      <SandpackProvider
        template={vfs.template}
        files={sandBoxFiles}
        customSetup={{
          dependencies: vfs.dependencies,
        }}
        options={{
          autorun: true,
          autoReload: true,
          recompileMode: "delayed",
          recompileDelay: 300,
        }}
        className="sandpack-full-height flex h-full w-full min-h-0 flex-1 flex-col"
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        <SandpackFilesSync files={sandBoxFiles} />

        <PreviewUI
          vfs={vfs}
          isFullScreen={isFullScreen}
          onToggleFullScreen={() => setIsFullScreen((prev) => !prev)}
          onDisconnect={() => setConnected(false)}
        />
      </SandpackProvider>
    </div>
  );
}

/**
 * Synchronizes additions, modifications, and deletions with Sandpack's runtime
 */
function SandpackFilesSync({ files }: { files: SandpackFiles }) {
  const { sandpack } = useSandpack();

  useEffect(() => {
    // 1. Update modified or new files
    for (const [path, file] of Object.entries(files)) {
      const current = sandpack.files[path];
      const currentCode =
        typeof current === "string" ? current : (current?.code ?? "");

      if (currentCode !== file.code) {
        sandpack.updateFile(path, file.code);
      }
    }

    // 2. Clean up removed files
    const sandpackFilePaths = Object.keys(sandpack.files);
    for (const existingPath of sandpackFilePaths) {
      if (existingPath.startsWith("/__")) continue;
      if (!files[existingPath]) {
        sandpack.deleteFile(existingPath);
      }
    }
  }, [files, sandpack]);

  return null;
}




