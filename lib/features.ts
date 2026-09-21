import { ExplorerFolder, FolderCache } from "./store/types/explorerTypes";

export const getOutputColor = (type: string) => {
  switch (type) {
    case "error":
      return "text-[#f48771]";
    case "success":
      return "text-[#89d185]";
    case "info":
      return "text-[#75beff]";
    case "input":
      return "text-[#cccccc]";
    default:
      return "text-[#cccccc]";
  }
};

export function getTimeOfDay() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Good Evening";
  } else {
    return "Hello";
  }
}

const languageIconMap: Record<string, string> = {
  javascript: "vscode-icons:file-type-js-official",
  typescript: "vscode-icons:file-type-typescript-official",
  python: "vscode-icons:file-type-python",
  c: "vscode-icons:file-type-c",
  cpp: "vscode-icons:file-type-cpp",
  java: "vscode-icons:file-type-java",
  csharp: "vscode-icons:file-type-csharp",
  go: "vscode-icons:file-type-go",
  rust: "vscode-icons:file-type-rust",
  php: "vscode-icons:file-type-php",
  ruby: "vscode-icons:file-type-ruby",
  kotlin: "vscode-icons:file-type-kotlin",
  swift: "vscode-icons:file-type-swift",
  dart: "vscode-icons:file-type-dart",
  scala: "vscode-icons:file-type-scala",
  r: "vscode-icons:file-type-r",
  lua: "vscode-icons:file-type-lua",
  perl: "vscode-icons:file-type-perl",
  haskell: "vscode-icons:file-type-haskell",
  shell: "vscode-icons:file-type-shell",
  html: "vscode-icons:file-type-html",
  css: "vscode-icons:file-type-css",
  scss: "vscode-icons:file-type-scss",
  sass: "vscode-icons:file-type-sass",
  json: "vscode-icons:file-type-json",
  markdown: "vscode-icons:file-type-markdown",
  yaml: "vscode-icons:file-type-yaml",
  xml: "vscode-icons:file-type-xml",
  graphql: "vscode-icons:file-type-graphql",
  vue: "vscode-icons:file-type-vue",
  svelte: "vscode-icons:file-type-svelte",
  dockerfile: "vscode-icons:file-type-docker",
};

export function getFileIcon(fileName: string): string {
  const type = getType(fileName);

  return languageIconMap[type?.language ?? ""] ?? "vscode-icons:default-file";
}

export interface LanguageInfo {
  language: string;
  id?: number;
}

export const languageMap: Record<string, LanguageInfo> = {
  // JavaScript
  js: { language: "javascript", id: 63 },
  jsx: { language: "javascript", id: 63 },
  mjs: { language: "javascript", id: 63 },
  cjs: { language: "javascript", id: 63 },

  // TypeScript
  ts: { language: "typescript", id: 74 },
  tsx: { language: "typescript", id: 74 },
  mts: { language: "typescript", id: 74 },
  cts: { language: "typescript", id: 74 },

  // Python
  py: { language: "python", id: 71 },
  pyw: { language: "python", id: 71 },

  // C
  c: { language: "c", id: 50 },
  h: { language: "c", id: 50 },

  // C++
  cpp: { language: "cpp", id: 54 },
  cc: { language: "cpp", id: 54 },
  cxx: { language: "cpp", id: 54 },
  hpp: { language: "cpp", id: 54 },

  // Java
  java: { language: "java", id: 62 },

  // C#
  cs: { language: "csharp", id: 51 },

  // Go
  go: { language: "go", id: 60 },

  // Rust
  rs: { language: "rust", id: 73 },

  // PHP
  php: { language: "php", id: 68 },

  // Ruby
  rb: { language: "ruby", id: 72 },

  // Kotlin
  kt: { language: "kotlin", id: 78 },
  kts: { language: "kotlin", id: 78 },

  // Swift
  swift: { language: "swift", id: 83 },

  // Dart
  dart: { language: "dart", id: 90 },

  // Scala
  scala: { language: "scala", id: 81 },

  // R
  r: { language: "r", id: 80 },

  // Lua
  lua: { language: "lua", id: 64 },

  // Perl
  pl: { language: "perl", id: 85 },

  // Haskell
  hs: { language: "haskell", id: 61 },

  // Shell
  sh: { language: "shell", id: 46 },
  bash: { language: "shell", id: 46 },

  // SQL - editor only
  sql: { language: "sql" },

  // HTML - editor only
  html: { language: "html" },
  htm: { language: "html" },

  // CSS - editor only
  css: { language: "css" },
  scss: { language: "scss" },
  sass: { language: "sass" },

  // JSON - editor only
  json: { language: "json" },

  // Markdown - editor only
  md: { language: "markdown" },
  markdown: { language: "markdown" },

  // YAML - editor only
  yaml: { language: "yaml" },
  yml: { language: "yaml" },

  // XML - editor only
  xml: { language: "xml" },

  // GraphQL - editor only
  graphql: { language: "graphql" },
  gql: { language: "graphql" },

  // Vue - editor only
  vue: { language: "vue" },

  // Svelte - editor only
  svelte: { language: "svelte" },
};

export function getType(fileName: string): LanguageInfo | null {
  const name = fileName.toLowerCase();

  if (name === "dockerfile") {
    return {
      language: "dockerfile",
    };
  }

  const extension = name.split(".").pop();

  if (!extension) {
    return null;
  }

  return languageMap[extension] ?? null;
}

export type SandpackFile = {
  code: string;
  fileId: string;
  isSynthesized?: boolean;
};

export type VirtualFileSystem = {
  files: Record<string, SandpackFile>;
  template:
    | "react"
    | "react-ts"
    | "vanilla"
    | "vanilla-ts"
    | "vue"
    | "svelte"
    | "static";
  dependencies: Record<string, string>;
  hasHtmlFile: boolean;
  htmlFiles: string[];
  entryFiles: string[];
  totalFiles: number;
  totalBytes: number;
};

/**
 * Normalizes file paths so they consistently start with `/` and use `/` separators.
 */
export function normalizeVirtualPath(filePath: string): string {
  const normalized = filePath.replace(/\\+/g, "/").replace(/\/+/g, "/").trim();
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

/**
 * Enhanced Virtual File System collector:
 * - Walks all cached directories and collects active code or fallback content
 * - Normalizes file paths consistently
 * - Auto-detects project template (React, Vue, Svelte, Vanilla, Static)
 * - Parses package.json dependencies for Sandpack customSetup
 * - Generates a smart fallback index.html if none exists so preview never crashes
 */
export function collectVirtualFileSystem(
  cache: Record<string, FolderCache>,
  rootId: string,
  code: Record<string, { content?: string }>,
): VirtualFileSystem {
  const files: Record<string, SandpackFile> = {};
  let totalBytes = 0;

  function walk(folderId: string, currentPath = "") {
    const folder = cache[folderId];
    if (!folder) return;

    // ---------------- FILES ----------------
    for (const file of folder.files ?? []) {
      const rawPath = currentPath ? `${currentPath}/${file.name}` : file.name;
      const normalizedPath = normalizeVirtualPath(rawPath);
      const fileCode = code?.[file._id]?.content ?? file.content ?? "";

      files[normalizedPath] = {
        fileId: file._id,
        code: fileCode,
      };

      totalBytes += fileCode.length;
    }

    // ---------------- FOLDERS ----------------
    for (const child of folder.folders ?? []) {
      const childPath = currentPath
        ? `${currentPath}/${child.name}`
        : child.name;
      walk(child._id, childPath);
    }
  }

  if (rootId) {
    walk(rootId);
  }

  const allPaths = Object.keys(files);
  const htmlFiles = allPaths.filter((path) =>
    path.toLowerCase().endsWith(".html"),
  );
  let hasHtmlFile = htmlFiles.length > 0;

  // Extract package.json dependencies if present
  let dependencies: Record<string, string> = {};
  const packageJsonPath = allPaths.find((p) => p.toLowerCase() === "/package.json");
  if (packageJsonPath && files[packageJsonPath]) {
    try {
      const parsed = JSON.parse(files[packageJsonPath].code);
      if (parsed && typeof parsed === "object") {
        dependencies = {
          ...(typeof parsed.dependencies === "object" ? parsed.dependencies : {}),
          ...(typeof parsed.devDependencies === "object" ? parsed.devDependencies : {}),
        };
      }
    } catch {
      // Invalid package.json, ignore syntax errors
    }
  }

  // Detect Framework Template
  let template: VirtualFileSystem["template"] = "static";
  const hasTsx = allPaths.some((p) => p.endsWith(".tsx"));
  const hasJsx = allPaths.some((p) => p.endsWith(".jsx"));
  const hasTs = allPaths.some((p) => p.endsWith(".ts"));
  const hasVue = allPaths.some((p) => p.endsWith(".vue"));
  const hasSvelte = allPaths.some((p) => p.endsWith(".svelte"));
  const hasReactDep = Boolean(dependencies["react"] || dependencies["react-dom"]);
  const hasVueDep = Boolean(dependencies["vue"]);
  const hasSvelteDep = Boolean(dependencies["svelte"]);

  // If project has HTML files and is not explicitly a React/Vue/Svelte project, use "static"
  // so Sandpack serves and previews the HTML file directly!
  if (hasHtmlFile && !hasReactDep && !hasVueDep && !hasSvelteDep && !hasTsx && !hasJsx) {
    template = "static";
  } else if (hasReactDep || (hasTsx && !hasHtmlFile)) {
    template = "react-ts";
  } else if (hasJsx && !hasHtmlFile) {
    template = "react";
  } else if (hasVue || hasVueDep) {
    template = "vue";
  } else if (hasSvelte || hasSvelteDep) {
    template = "svelte";
  } else if (hasTs && !hasHtmlFile) {
    template = "vanilla-ts";
  } else if (allPaths.some((p) => p.endsWith(".js")) && !hasHtmlFile) {
    template = "vanilla";
  } else {
    template = "static";
  }

  // Ensure /index.html is always present if any HTML file exists
  if (htmlFiles.length > 0 && !files["/index.html"]) {
    const primaryHtmlPath =
      htmlFiles.find((p) => p.toLowerCase().includes("index")) ?? htmlFiles[0];
    if (primaryHtmlPath && files[primaryHtmlPath]) {
      files["/index.html"] = {
        ...files[primaryHtmlPath],
        fileId: files[primaryHtmlPath].fileId,
        isSynthesized: true,
      };
    }
  }

  // Detect potential entry scripts and stylesheets
  const entryFiles: string[] = [];
  const scriptCandidates = allPaths.filter((p) =>
    /\.(js|jsx|ts|tsx)$/i.test(p) && !p.includes("__sandbox"),
  );
  const cssCandidates = allPaths.filter((p) => /\.(css|scss|sass)$/i.test(p));

  // If there's no HTML file, synthesize an index.html entry point
  if (!hasHtmlFile && allPaths.length > 0) {
    const primaryScript =
      scriptCandidates.find((p) => /(index|main|app)\.(js|jsx|ts|tsx)$/i.test(p)) ??
      scriptCandidates[0];
    const primaryCss =
      cssCandidates.find((p) => /(index|main|style|styles)\.css$/i.test(p)) ??
      cssCandidates[0];

    const scriptTag = primaryScript
      ? `<script type="module" src="${primaryScript}"></script>`
      : "";
    const styleTag = primaryCss
      ? `<link rel="stylesheet" href="${primaryCss}" />`
      : "";

    const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sandbox Preview</title>
  ${styleTag}
</head>
<body style="margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #1e1e1e;">
  <div id="root"></div>
  <div id="app"></div>
  ${
    !primaryScript
      ? `<div style="padding: 20px; border: 1px dashed #cccccc; border-radius: 8px; text-align: center;">
          <h2 style="margin: 0 0 8px 0; font-size: 16px;">Virtual File System Active</h2>
          <p style="margin: 0; font-size: 12px; color: #666666;">Create an <code>index.html</code> or script file to see your live output.</p>
        </div>`
      : ""
  }
  ${scriptTag}
</body>
</html>`;

    files["/index.html"] = {
      fileId: "__synthesized_index_html",
      code: fallbackHtml,
      isSynthesized: true,
    };

    hasHtmlFile = true;
    htmlFiles.push("/index.html");
  }

  return {
    files,
    template,
    dependencies,
    hasHtmlFile,
    htmlFiles,
    entryFiles: scriptCandidates,
    totalFiles: Object.keys(files).length,
    totalBytes,
  };
}

export default function collectFiles(
  cache: Record<string, FolderCache>,
  rootId: string,
  code: Record<string, { content?: string }>,
): Record<string, SandpackFile> {
  const vfs = collectVirtualFileSystem(cache, rootId, code);
  return vfs.files;
}
