import mime from "mime-types";

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
// https://i.waifu.pics/8m-r1_O.png

const languageMap: Record<string, { language: string; id: number }> = {
  js: { language: "javascript", id: 63 },
  jsx: { language: "javascript", id: 63 },
  ts: { language: "typescript", id: 74 },
  tsx: { language: "typescript", id: 74 },
  py: { language: "python", id: 71 },
  java: { language: "java", id: 62 },
  cpp: { language: "cpp", id: 54 },
};
export function getType(fileName: string) {
  const type = mime.lookup(fileName);

  const ext = mime.extension(type);

  if (!ext) return languageMap[fileName?.split(".")[1]] || "plaintext";

  return languageMap[ext] || "plaintext";
}

export function formatLastOpened(date: Date | string) {
  const opened = new Date(date);
  const now = new Date();

  const openedDay = new Date(
    opened.getFullYear(),
    opened.getMonth(),
    opened.getDate(),
  );

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diff = (today.getTime() - openedDay.getTime()) / (1000 * 60 * 60 * 24);
  if (isNaN(opened.getTime())) {
    return "Never opened";
  }
  if (diff === 0) {
    return `Opened today at ${opened.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  if (diff === 1) {
    return `Opened yesterday at ${opened.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  if (diff < 7) return `Opened ${diff} days ago`;

  return `Opened ${opened.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}
