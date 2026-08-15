import { CodeOutput, User } from "@/lib/store/types/codeTypes";
import { ExplorerFile, ExplorerFolder } from "@/lib/store/types/explorerTypes";

export interface AiMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  loading?: boolean;
  prompt?: string;
  name?: string | null;
  image?: string | null;
  createdAt?: string;
}

export interface TerminalOutput {
  id: string;
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  error?: string;
  action: string;
}

export type MessagesEvent = {
  user: User;
  payload: AiMessage;
};

export type TerminalEvent = {
  action: "clear" | "run code" | "help";
  data: TerminalOutput[];
};

export type SocketContextType = {
  applyResponse: (payload: string) => void;
  applyOutput: (payload: CodeOutput[], action: string) => void;
  applyCreate: {
    (parentId: string, item: ExplorerFile, target: "file"): void;

    (parentId: string, item: ExplorerFolder, target: "folder"): void;
  };

  applyUpdate: (
    parentId: string,
    id: string,
    newName: string,
    target: "file" | "folder",
  ) => void;

  applyRemove: (
    parentId: string,
    id: string,
    target: "file" | "folder",
    item: ExplorerFile | ExplorerFolder,
  ) => void;
};
