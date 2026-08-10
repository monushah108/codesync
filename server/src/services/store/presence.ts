import type { ConnectedUser } from "../types.js";

export class PresenceStore {
  private users = new Map<string, ConnectedUser>();

  set(socketId: string, user: ConnectedUser) {
    this.users.set(socketId, user);
  }

  get(socketId: string) {
    return this.users.get(socketId);
  }

  delete(socketId: string) {
    this.users.delete(socketId);
  }

  getRoomMembers(roomId: string) {
    return [...this.users.values()]
      .filter((member) => member.roomId === roomId)
      .map((member) => member.user);
  }

  has(socketId: string) {
    return this.users.has(socketId);
  }
}
