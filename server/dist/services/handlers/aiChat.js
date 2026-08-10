"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAIHandlers = registerAIHandlers;
const AI_INSTRUCTIONS = `
You are Codex AI.

Do not mention the user's name unless
the user explicitly mentions @bot.
`;
function registerAIHandlers(socket, { io, groq }) {
    const generatingRooms = new Set();
    socket.on("ai:chat", async ({ roomId, message, user, }) => {
        if (!roomId || !user?.id) {
            socket.emit("ai:error", {
                message: "Invalid request.",
            });
            return;
        }
        if (!message?.trim()) {
            return;
        }
        if (generatingRooms.has(roomId)) {
            socket.emit("ai:error", {
                message: "AI is already generating a response.",
            });
            return;
        }
        generatingRooms.add(roomId);
        io.to(roomId).emit("ai:loading", true);
        try {
            const stream = await groq.chat.completions.create({
                model: process.env.AI_MODEL,
                messages: [
                    {
                        role: "system",
                        content: AI_INSTRUCTIONS,
                    },
                    {
                        role: "user",
                        content: `
The current message was sent by ${user.name}.

Message:
${message}
`,
                    },
                ],
                stream: true,
            });
            for await (const chunk of stream) {
                const token = chunk.choices[0]?.delta?.content;
                if (!token) {
                    continue;
                }
                io.to(roomId).emit("ai:token", token);
            }
            io.to(roomId).emit("ai:done");
        }
        catch (error) {
            console.error("AI error:", error);
            io.to(roomId).emit("ai:error", {
                message: "Something went wrong while generating the response.",
            });
        }
        finally {
            generatingRooms.delete(roomId);
            io.to(roomId).emit("ai:loading", false);
        }
    });
}
//# sourceMappingURL=aiChat.js.map