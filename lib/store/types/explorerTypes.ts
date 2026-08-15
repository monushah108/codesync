// explorer

export interface ExplorerFile {
  _id: string;
  name: string;
  parentId?: string;
  type?: "file";
  renamed?: boolean;
  isEdited: boolean;
}

export interface ExplorerFolder {
  _id: string;
  name: string;
  parentId?: string;
  type?: "folder";
  renamed?: boolean;
}

export interface RootFolder {
  _id: string;
  name: string;
  parentId?: string;
  renamed?: boolean;
}

export interface FolderCache {
  rootFolder?: RootFolder;

  folders: ExplorerFolder[];
  files: ExplorerFile[];

  selectedFileId?: string | null;

  loading: boolean;
  loaded: boolean;
  error?: string | null;
}

export interface Activity {
  id: string;
  [key: string]: unknown;
}

export interface ExplorerStore {
  cache: Record<string, FolderCache>;

  members: unknown[];

  activity: Activity[];

  setActivity: (activity: Activity) => void;

  removeActivity: (id: string) => void;

  setMembers: (members: unknown[]) => void;

  loadFolder: (data: {
    parentId: string;
    rootFolder?: RootFolder;
    folders?: ExplorerFolder[];
    files?: ExplorerFile[];
  }) => void;

  setLoading: (parentId: string, loading: boolean) => void;

  setError: (parentId: string, error: string) => void;

  setSelectedFile: (parentId: string, fileId: string | null) => void;

  insertFile: (parentId: string, file: ExplorerFile) => void;

  insertFolder: (parentId: string, folder: ExplorerFolder) => void;

  updateFile: (parentId: string, fileId: string, newName: string) => void;

  updateFolder: (parentId: string, folderId: string, newName: string) => void;

  removeFile: (parentId: string, fileId: string) => void;

  removeFolder: (parentId: string, folderId: string) => void;

  restore: (fileId: string, prevData: FolderCache) => void;
}
