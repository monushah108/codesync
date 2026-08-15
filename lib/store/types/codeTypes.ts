import { AiMessage } from "@/context/types";
import { auth } from "@/lib/auth";

export interface CodeFileState {
  content: string;
  savedContent?: string;

  loaded?: boolean;
  loading?: boolean;

  saving?: boolean;
  running?: boolean;

  isDeleted?: boolean;
  error?: string | null;
}

export interface OpenFile {
  _id: string;
  name: string;
  isEdited: boolean;

  [key: string]: string | boolean;
}

export type User = typeof auth.$Infer.Session.user;

export interface CodeOutput {
  id: string;
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  error?: string;
  loading?: boolean;
  loaded?: boolean;
}

export interface ExecutionResult {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  error?: string;
}

export interface AIResponse {
  data: AiMessage[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export interface CodeState {
  code: Record<string, CodeFileState>;

  openFiles: OpenFile[];

  activeFileId: string | null;

  outputs: CodeOutput[];

  user: User | null;

  response: AIResponse;
}

export interface Store extends CodeState {
  setUser: (user: User | null) => void;

  openFile: (file: OpenFile, roomId: string) => Promise<void>;

  closeFile: (fileId: string) => void;

  setActiveFile: (activeFileId: string | null) => void;

  setFileEdited: (fileId: string | null, edited: boolean) => void;

  updateContent: (fileId: string, content: string) => void;

  setLoadedFile: (
    fileId: string,
    data: {
      content?: string;
    },
  ) => void;

  setLoading: (fileId: string, loading: boolean) => void;

  setLoadFileError: (fileId: string, error: string) => void;

  setSavedFile: (fileId: string, content: string) => void;

  setSaving: (fileId: string, saving: boolean) => void;

  setSavedFileError: (fileId: string, error: string) => void;

  setExecutionResult: (fileId: string, result: ExecutionResult) => void;

  addOutput: (output: CodeOutput) => void;

  removeOutput: (id: string) => void;

  clearOutputs: () => void;

  runCommand: (command: string, fileId: string | null) => Promise<void>;

  setClearResponse: () => void;

  addMessage: (message: AiMessage) => void;
  addBotMessage: (message: string) => void;
  setGenerating: (generating: boolean) => void;

  setGeneratedError: (error: unknown) => void;
}
