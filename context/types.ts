import { CodeOutput, User } from "@/lib/store/types/codeTypes";

export interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  loading: boolean;
  prompt: string;
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
  applyResponse: (payload: AiMessage) => void;
  applyOutput: (payload: TerminalOutput, action: string) => void;
  applyCreate: () => void;
  applyUpdate: () => void;
  applyRemove: () => void;
};
