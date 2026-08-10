export type User = {
    id: string;
    name: string;
    email?: string | null;
    image?: string | null;
};
export type Room = {
    roomId: string;
    adminId: string;
    members: Map<string, User>;
};
export type ConnectedUser = {
    roomId: string;
    user: User;
};
export type Activity = {
    id: string;
    userId: string;
    userName: string;
    type: string;
    time: string;
    message?: string;
    target?: string;
    fileName?: string;
};
//# sourceMappingURL=types.d.ts.map