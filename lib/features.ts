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
    return "Morning";
  } else if (hour >= 12 && hour < 17) {
    return "Afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Evening";
  } else {
    return "Night";
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
