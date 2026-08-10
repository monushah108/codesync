import type { Server, Socket } from "socket.io";
import { Room, User } from "../types";

type AIDeps = {
  io: Server;
  rooms: Map<string, Room>;
  aiGenerating: Set<string>;
  groq: any;
};

export function registerAIHandlers(
  socket: Socket,
  { io, rooms, aiGenerating, groq }: AIDeps,
) {
  socket.on(
    "ai:chat",
    async ({
      roomId,
      message,
      user,
    }: {
      roomId: string;
      message: string;
      user: User;
    }) => {
      const room = rooms.get(roomId);

      if (!room) {
        return;
      }

      if (aiGenerating.has(roomId)) {
        socket.emit("ai:error", {
          message: "AI is already generating a response.",
        });

        return;
      }

      if (!message?.trim()) {
        return;
      }

      aiGenerating.add(roomId);

      io.to(roomId).emit("ai:loading", true);

      try {
        const stream = await groq.chat.completions.create({
          model: process.env.AI_MODEL!,
          messages: [
            {
              role: "system",
              content: `
You are Codex AI.

Do not mention the user's name unless
the user explicitly mentions @bot.
                `,
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

          if (token) {
            io.to(roomId).emit("ai:token", token);
          }
        }

        io.to(roomId).emit("ai:done");
      } catch (error) {
        console.error("AI error:", error);

        io.to(roomId).emit("ai:error", {
          message: "Something went wrong while generating the response.",
        });
      } finally {
        aiGenerating.delete(roomId);

        io.to(roomId).emit("ai:loading", false);
      }
    },
  );
}
