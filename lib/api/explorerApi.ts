// lib/api/explorer.ts

import { ExplorerFile, ExplorerFolder } from "../store/types/explorerTypes";
import { api } from "./client";

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
