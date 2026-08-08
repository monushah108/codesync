export type AiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  loading: boolean;
  prompt: string;
};

export type TerminalOutput = {
  id: string;
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  error?: string;
  action: string;
};

export type MessagesEvent = {
  payload: AiMessage;
};

export type TerminalEvent =
  | {
      type: "append";
      output: TerminalOutput;
    }
  | {
      type: "clear";
    };

export type SocketContextType = {
  applyResponse: (payload: AiMessage) => void;
  applyOutput: (payload: TerminalOutput) => void;
  applyCreate: () => void;
  applyUpdate: () => void;
  applyRemove: () => void;
};
