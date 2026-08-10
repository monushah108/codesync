import * as Y from "yjs";

export class YjsStore {
  private docs = new Map<string, Y.Doc>();

  getDoc(roomId: string, fileId: string) {
    const key = `${roomId}:${fileId}`;

    let doc = this.docs.get(key);

    if (!doc) {
      doc = new Y.Doc();
      this.docs.set(key, doc);
    }

    return doc;
  }

  deleteDoc(roomId: string, fileId: string) {
    const key = `${roomId}:${fileId}`;

    const doc = this.docs.get(key);

    if (!doc) {
      return;
    }

    doc.destroy();
    this.docs.delete(key);
  }
}
