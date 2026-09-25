// lib/api/explorer.ts

import { ExplorerFile, ExplorerFolder } from "../store/types/explorerTypes";
import { api } from "./client";
import { useCodestore } from "../store/Codestore";

export type FolderResponse = {
  folders: ExplorerFolder[];
  files: ExplorerFile[];
  rootFolder: ExplorerFolder;
};

/* -------------------------------------------------------------------------- */
/*                                   Folder                                   */
/* -------------------------------------------------------------------------- */

export async function loadFolder(
  roomId: string,
  parentId?: string,
): Promise<FolderResponse> {
  const { data } = await api.get<FolderResponse>(
    `/api/playground/${roomId}/directory`,
    {
      params: parentId ? { parentId } : "",
      withCredentials: true,
    },
  );

  return data;
}

export async function createFolder(
  roomId: string,
  parentId: string,
  name: string,
): Promise<ExplorerFolder> {
  const { data } = await api.post<ExplorerFolder>(
    `/api/playground/${roomId}/directory`,
    {
      parentId,
      name,
    },
    {
      withCredentials: true,
    },
  );

  return data;
}

export async function renameFolder(
  roomId: string,
  folderId: string,
  name: string,
): Promise<ExplorerFolder> {
  const { data } = await api.patch<ExplorerFolder>(
    `/api/playground/${roomId}/directory`,
    {
      id: folderId,
      name,
    },
    {
      withCredentials: true,
    },
  );

  return data;
}

export async function deleteFolder(
  roomId: string,
  folderId: string,
): Promise<void> {
  await api.delete(`/api/playground/${roomId}/directory`, {
    withCredentials: true,
    data: {
      id: folderId,
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                                    File                                    */
/* -------------------------------------------------------------------------- */

export async function createFile(
  roomId: string,
  parentId: string,
  name: string,
): Promise<ExplorerFile> {
  const { data } = await api.post<ExplorerFile>(
    `/api/playground/${roomId}/files`,
    {
      parentId,
      name,
    },
    {
      withCredentials: true,
    },
  );

  return data;
}

export async function renameFile(
  roomId: string,
  fileId: string,
  name: string,
): Promise<ExplorerFile> {
  const { data } = await api.patch<ExplorerFile>(
    `/api/playground/${roomId}/files`,
    {
      id: fileId,
      name,
    },
    {
      withCredentials: true,
    },
  );

  return data;
}

export async function deleteFile(
  roomId: string,
  fileId: string,
): Promise<void> {
  await api.delete(`/api/playground/${roomId}/files`, {
    withCredentials: true,
    data: {
      id: fileId,
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                                  Download                                  */
/* -------------------------------------------------------------------------- */

function triggerBlobDownload(
  blob: Blob,
  fallbackFilename: string,
  disposition?: string | null,
): void {
  let filename = fallbackFilename;

  if (disposition) {
    const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match && utf8Match[1]) {
      try {
        filename = decodeURIComponent(utf8Match[1]);
      } catch {
        filename = utf8Match[1];
      }
    } else {
      const standardMatch = disposition.match(/filename="?([^";]+)"?/i);
      if (standardMatch && standardMatch[1]) {
        filename = standardMatch[1];
      }
    }
  }

  const blobUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.style.display = "none";
  anchor.href = blobUrl;
  anchor.download = filename;
  anchor.setAttribute("download", filename);
  anchor.addEventListener("click", (e) => e.stopPropagation());

  document.body.appendChild(anchor);
  anchor.click();

  setTimeout(() => {
    try {
      if (document.body.contains(anchor)) {
        document.body.removeChild(anchor);
      }
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // ignore cleanup errors
    }
  }, 1000);
}

export async function downloadProject(
  roomId: string,
  folderId?: string,
  fallbackName?: string,
): Promise<void> {
  const url = folderId
    ? `/api/playground/${roomId}/download?folderId=${encodeURIComponent(folderId)}`
    : `/api/playground/${roomId}/download`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error || "Failed to download project");
  }

  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition");
  triggerBlobDownload(
    blob,
    fallbackName ? `${fallbackName}.zip` : "project.zip",
    disposition,
  );
}

export async function downloadFile(
  roomId: string,
  fileId: string,
  fileName?: string,
  content?: string,
): Promise<void> {
  const fallbackName = fileName || "file.txt";

  // Check if content is provided directly or exists in local Zustand code cache with latest unsaved edits
  let fileContent = content;
  if (typeof fileContent !== "string") {
    const cached = useCodestore.getState().code[fileId];
    if (cached && typeof cached.content === "string") {
      fileContent = cached.content;
    }
  }

  // If in-memory content is available, trigger immediate instant blob download
  if (typeof fileContent === "string") {
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    triggerBlobDownload(blob, fallbackName);
    return;
  }

  // Otherwise fetch from server endpoint
  const url = `/api/playground/${roomId}/download?fileId=${encodeURIComponent(fileId)}`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error || "Failed to download file");
  }

  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition");
  triggerBlobDownload(blob, fallbackName, disposition);
}

