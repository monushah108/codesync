import { ExplorerFile, ExplorerFolder } from "../store/types/explorerTypes";

export type ExplorerOperation =
  | {
      type: "add";
      target: "file";
      payload: {
        parentId: string;
        file: ExplorerFile;
      };
    }
  | {
      type: "add";
      target: "folder";
      payload: {
        parentId: string;
        folder: ExplorerFolder;
      };
    }
  | {
      type: "update";
      target: "file";
      payload: {
        parentId: string;
        id: string;
        newName: string;
      };
    }
  | {
      type: "update";
      target: "folder";
      payload: {
        parentId: string;
        id: string;
        newName: string;
      };
    }
  | {
      type: "remove";
      target: "file";
      payload: {
        parentId: string;
        id: string;
        file: string;
      };
    }
  | {
      type: "remove";
      target: "folder";
      payload: {
        parentId: string;
        id: string;
        folder: string;
      };
    };

export type UseExplorerSocket = {
  applyCreate(parentId: string, item: ExplorerFile, target: "file"): void;

  applyCreate(parentId: string, item: ExplorerFolder, target: "folder"): void;

  applyUpdate(
    parentId: string,
    id: string,
    newName: string,
    target: "file" | "folder",
  ): void;

  applyRemove(
    parentId: string,
    id: string,
    target: "file" | "folder",
    item: ExplorerFile | ExplorerFolder,
  ): void;
};

export type Activity = {
  id: string;
  roomId: string;

  user: {
    id: string;
    name: string;
    image?: string;
  };

  type: "create" | "rename" | "delete" | "move" | "save" | "join" | "leave";

  target: "file" | "folder" | "room";

  targetName: string;

  createdAt: number;
};
