import * as Y from "yjs";
import type Redis from "ioredis";
export declare class YjsStore {
    private docs;
    private redis;
    constructor(redis: Redis);
    getDoc(roomId: string, fileId: string): Promise<Y.Doc>;
    getDocSync(roomId: string, fileId: string): Y.Doc;
    persistDoc(roomId: string, fileId: string): Promise<void>;
    applyRemoteUpdate(roomId: string, fileId: string, update: Uint8Array | number[]): void;
    deleteDoc(roomId: string, fileId: string): Promise<void>;
    deleteRoomDocs(roomId: string): Promise<void>;
}
//# sourceMappingURL=yjStore.d.ts.map