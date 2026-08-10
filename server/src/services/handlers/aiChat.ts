import type { Server, Socket } from "socket.io";
import Groq from "groq-sdk";

import type { User } from "../types.js";

interface AIHandlerDeps {
  io: Server;
  groq: Groq;
}

const AI_INSTRUCTIONS = `
You are Codex AI.

Do not mention the user's name unless
the user explicitly mentions @bot.
`;

export function registerAIHandlers(
  socket: Socket,
  { io, groq }: AIHandlerDeps,
) {
  const generatingRooms = new Set<string>();

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
          model: process.env.AI_MODEL!,
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
      } catch (error) {
        console.error("AI error:", error);

        io.to(roomId).emit("ai:error", {
          message: "Something went wrong while generating the response.",
        });
      } finally {
        generatingRooms.delete(roomId);

        io.to(roomId).emit("ai:loading", false);
      }
    },
  );
}
