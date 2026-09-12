import type { Server, Socket } from "socket.io";
import Groq from "groq-sdk";
import * as Y from "yjs";
import type { User } from "../types.js";
import { PresenceStore } from "../store/presence.js";
import { randomUUID } from "node:crypto";
import { YjsStore } from "../store/yjStore.js";
import { ChatStore } from "../store/chatstore.js";

interface AIHandlerDeps {
  io: Server;
  groq: Groq;
  presence: PresenceStore;
  yjs: YjsStore;
}

const AI_INSTRUCTIONS = `
You are CodeSync AI, an AI coding assistant inside a collaborative code editor.

Your primary purpose is to help users with:
- Writing and modifying code
- Explaining code
- Debugging errors
- Reviewing code
- Suggesting improvements
- Explaining programming concepts
- Working with the code and context provided by the user

Formatting:
- Use Markdown formatting when it improves readability.
- Use normal paragraphs for explanations and conversation.
- Use bullet points or numbered lists when presenting multiple items or steps.
- Use **bold** for important terms when useful.
- Use inline code for filenames, variables, functions, commands, APIs, and technical terms.
- Use fenced code blocks only when displaying actual source code.
- Always specify the appropriate language for code blocks when possible, such as \`typescript\`, \`javascript\`, \`tsx\`, \`bash\`, \`json\`, or \`css\`.
- Never wrap the complete response in a code block.
- Do not use Markdown formatting unnecessarily.
- Keep code blocks focused on actual code. Do not put explanations inside code blocks.

Code examples:
- When providing code, make sure the code is syntactically valid and directly related to the user's question.
- Do not invent files, functions, variables, APIs, or project details that were not provided.
- If the user's existing code is provided, base your suggestions on that code.
- When modifying code, clearly provide the relevant updated code.

Response style:
- Be concise when a short answer is sufficient.
- Give step-by-step explanations when the problem requires multiple steps.
- Avoid unnecessary repetition.
- Do not repeat the user's question unnecessarily.
- Do not repeat the same explanation or code unless it is necessary.
- Prefer practical solutions over theoretical explanations.

Scope:
- Focus on programming, software development, debugging, code review, architecture, APIs, databases, authentication, security, performance, Git, GitHub, DevOps, and related technical topics.
- If the user asks something unrelated to programming, coding, or the provided code, politely decline and briefly explain that you are focused on coding assistance.

Context:
- Base your response on the user's code and the context they provide.
- Do not assume details about the user's codebase that were not provided.
- If important information is missing, state the assumption or ask for the relevant code/context.

Identity:
- You are CodeSync AI.
- Do not mention the user's name unless the user explicitly mentions their name.
`;

const chatStore = new ChatStore();

function getFileContent(doc: Y.Doc): string {
  const content = doc.getText("editor").toString();

  return content.trim().length > 0 ? content : "(file is empty)";
}

export function registerAIHandlers(
  socket: Socket,
  { io, groq, presence, yjs }: AIHandlerDeps,
) {
  const generatingRooms = new Set<string>();

  socket.on(
    "ai:chat",
    async ({
      roomId,
      message,
      user,
      fileId,
    }: {
      roomId: string;
      message: string;
      user: User;
      fileId: string;
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
        const doc = yjs.getDoc(roomId, fileId);
        const fileContent = getFileContent(doc);

        // Get the existing conversation history.
        const history = chatStore.getHistory(roomId).slice(-20);

        // Convert stored messages into Groq-compatible messages.
        const previousMessages = history.map((item) => ({
          role: item.role,
          content: item.content,
        }));
        const currentMessage = `
The current message was sent by ${user.name}.


${fileId && "Current file content:" + fileContent}

Message:
${message}
`;

        const stream = await groq.chat.completions.create({
          model: process.env.AI_MODEL!,
          messages: [
            {
              role: "system",
              content: AI_INSTRUCTIONS,
            },
            ...previousMessages,
            {
              role: "user",
              content: currentMessage,
            },
          ],
          stream: true,
        });

        let content = "";

        for await (const chunk of stream) {
          const token = chunk.choices[0]?.delta?.content;

          if (!token) {
            continue;
          }

          content += token;

          io.to(roomId).emit("ai:token", token);
        }

        // Save the complete AI response in history.
        const assistantMessage = chatStore.setHistory(
          roomId,
          content,
          "assistant",
        );

        io.to(roomId).emit("ai:done", {
          message: assistantMessage,
        });
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

  socket.on("messages", ({ roomId, user, payload }) => {
    const mentionedMembers = presence.getRoomMembers(roomId).filter((m) => {
      const name = m.name.trim();

      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      return new RegExp(`(^|\\s)@${escapedName}(?=\\s|$)`, "i").test(
        payload.prompt,
      );
    });

    for (const mentioned of mentionedMembers) {
      io.to(roomId).emit("activity", {
        id: randomUUID(),
        type: "mention",
        message: `${user.name} mentioned ${mentioned.name} in chat`,
        time: new Date().toLocaleTimeString(),
      });
    }

    // ------------------------------------------
    // Save normal chat message
    // ------------------------------------------

    chatStore.setHistory(
      roomId,
      payload.prompt,

      "user",
      user.id,
      user.name,
    );

    io.to(roomId).emit("messages", {
      user,
      payload,
    });
  });

  socket.on("clear:msg", ({ roomId }) => {
    chatStore.deleteHistory(roomId);
    io.to(roomId).emit("msg:cleared");
  });
}
