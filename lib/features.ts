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

export const getRandomImg = async () => {
  const res = await fetch("https://c.tenor.com/SH_u4G_adZYAAAAd/tenor.gif");
  const data = await res.json();
  return data.data.images.jpg.image_url;
};
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
