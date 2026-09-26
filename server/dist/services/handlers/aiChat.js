"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAIHandlers = registerAIHandlers;
const node_crypto_1 = require("node:crypto");
// Global active streams map keyed by roomId to allow instant cancellation
const activeStreams = new Map();
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
const AI_EDIT_SYSTEM_PROMPT = `You are Antigravity AI, an expert code transformation engine integrated directly into the code editor.
Your objective is to edit, fix, or generate code with surgical precision based on the user's instructions.

CRITICAL INSTRUCTIONS:
1. Return ONLY the raw code replacement.
2. DO NOT include markdown code blocks, backticks (\`\`\` or \`\`\`lang), conversational greetings, explanations, or notes.
3. Output the exact source code characters directly.
4. Maintain consistent indentation (tabs/spaces) matching the surrounding code.
5. If target selection is provided, return ONLY the replacement for the specified selection.
6. If the whole file is targeted, return the full updated file content.
7. Ensure valid syntax and avoid breaking unaffected code.`;
const AI_EXPLAIN_SYSTEM_PROMPT = `You are Antigravity AI, an expert code explainer integrated into CodeSync editor.
Provide a clear, concise, and insightful explanation of the provided code or selection.
Structure your answer with:
- **Summary**: High-level overview of what the code achieves.
- **Key Mechanics**: Bullet points explaining crucial logic, algorithms, or APIs.
- **Edge Cases & Performance**: Important considerations or performance insights.
Format with clean GitHub-flavored markdown.`;
function getFileContent(doc) {
    const content = doc.getText("editor").toString();
    return content.trim().length > 0 ? content : "(file is empty)";
}
function registerAIHandlers(socket, { io, groq, presence, yjs, chatStore, redis }) {
    // 1. Normal AI Chat (Sidebar/panel)
    socket.on("ai:chat", async ({ roomId, message, user, fileId, }) => {
        if (!roomId || !user?.id) {
            socket.emit("ai:error", {
                message: "Invalid request.",
            });
            return;
        }
        if (!message?.trim()) {
            return;
        }
        const lockKey = `ai:generating:${roomId}`;
        // Acquire distributed lock for generating AI in this room
        const acquired = await redis.set(lockKey, socket.id, "EX", 120, "NX");
        if (!acquired) {
            socket.emit("ai:error", {
                message: "AI is already generating a response.",
            });
            return;
        }
        const abortController = new AbortController();
        activeStreams.set(roomId, abortController);
        io.to(roomId).emit("ai:loading", true);
        try {
            const doc = await yjs.getDoc(roomId, fileId);
            const fileContent = getFileContent(doc);
            // Get the existing conversation history from Redis
            const rawHistory = await chatStore.getHistory(roomId);
            const history = rawHistory.slice(-20);
            // Convert stored messages into Groq-compatible messages.
            const previousMessages = history.map((item) => ({
                role: item.role,
                content: item.content,
            }));
            const currentMessage = `
The current message was sent by ${user.name}.

${fileId ? "Current file content:\n" + fileContent : ""}

Message:
${message}
`;
            const stream = await groq.chat.completions.create({
                model: process.env.AI_MODEL,
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
            }, { signal: abortController.signal });
            let content = "";
            for await (const chunk of stream) {
                const token = chunk.choices[0]?.delta?.content;
                if (!token)
                    continue;
                content += token;
                io.to(roomId).emit("ai:token", token);
            }
            // Save the complete AI response in Redis history.
            const assistantMessage = await chatStore.setHistory(roomId, content, "assistant");
            io.to(roomId).emit("ai:done", {
                message: assistantMessage,
            });
        }
        catch (error) {
            if (error?.name === "AbortError" || abortController.signal.aborted) {
                console.log(`[AI] Stream aborted in room ${roomId}`);
                io.to(roomId).emit("ai:stopped", { roomId });
            }
            else {
                console.error("AI error:", error);
                io.to(roomId).emit("ai:error", {
                    message: "Something went wrong while generating the response.",
                });
            }
        }
        finally {
            activeStreams.delete(roomId);
            await redis.del(lockKey);
            io.to(roomId).emit("ai:loading", false);
        }
    });
    // 2. Real-time AI Code Edit / Explain / Fix with Cursor Awareness
    socket.on("ai:edit", async ({ roomId, fileId, user, prompt, mode = "edit", selection = null, cursorPosition = null, fileName = "", language = "", currentContent = "", }) => {
        if (!roomId || !fileId || !prompt?.trim()) {
            socket.emit("ai:edit:error", {
                message: "Invalid prompt or file target.",
            });
            return;
        }
        const lockKey = `ai:generating:${roomId}`;
        const acquired = await redis.set(lockKey, socket.id, "EX", 120, "NX");
        if (!acquired) {
            socket.emit("ai:edit:error", {
                message: "AI is already generating in this room.",
            });
            return;
        }
        const abortController = new AbortController();
        activeStreams.set(roomId, abortController);
        io.to(roomId).emit("ai:edit:start", {
            roomId,
            fileId,
            user,
            mode,
            selection,
            cursorPosition,
        });
        try {
            let fileContent = currentContent;
            if (!fileContent) {
                const doc = await yjs.getDoc(roomId, fileId);
                fileContent = getFileContent(doc);
            }
            const isExplain = mode === "explain";
            const systemPrompt = isExplain
                ? AI_EXPLAIN_SYSTEM_PROMPT
                : AI_EDIT_SYSTEM_PROMPT;
            let userPrompt = "";
            if (isExplain) {
                userPrompt = `
File: ${fileName || "Code"} (${language || "plaintext"})

${selection && selection.selectedText
                    ? `Target Selection (Lines ${selection.startLineNumber}–${selection.endLineNumber}):\n\`\`\`${language}\n${selection.selectedText}\n\`\`\``
                    : `Full File Content:\n\`\`\`${language}\n${fileContent}\n\`\`\``}

User question / request:
${prompt}
`;
            }
            else {
                userPrompt = `
File: ${fileName || "file"}
Language: ${language || "plaintext"}

Full Document Content:
${fileContent}

${selection && selection.selectedText
                    ? `Target Selection to Replace (Lines ${selection.startLineNumber} to ${selection.endLineNumber}):\n${selection.selectedText}`
                    : `Current Cursor Position: Line ${cursorPosition?.lineNumber ?? 1}, Column ${cursorPosition?.column ?? 1}.\nTarget: Entire file or insertion at cursor.`}

Instruction:
${prompt}

Remember: Output ONLY the raw replacement code. No backticks, no comments, no greetings.
`;
            }
            const stream = await groq.chat.completions.create({
                model: process.env.AI_MODEL,
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: userPrompt,
                    },
                ],
                stream: true,
            }, { signal: abortController.signal });
            let content = "";
            const baseLine = selection?.startLineNumber ?? cursorPosition?.lineNumber ?? 1;
            for await (const chunk of stream) {
                const token = chunk.choices[0]?.delta?.content;
                if (!token)
                    continue;
                content += token;
                // Strip accidental wrapping markdown code fences if model outputted them despite instructions
                let cleanedContent = content;
                if (!isExplain) {
                    if (cleanedContent.startsWith("```")) {
                        const firstNewline = cleanedContent.indexOf("\n");
                        if (firstNewline !== -1) {
                            cleanedContent = cleanedContent.slice(firstNewline + 1);
                        }
                    }
                }
                // Calculate dynamic AI cursor line and column based on streamed text
                const lines = cleanedContent.split("\n");
                const lineCount = lines.length;
                const currentAiLine = baseLine + lineCount - 1;
                const currentAiCol = (lines[lines.length - 1]?.length || 0) + 1;
                io.to(roomId).emit("ai:edit:token", {
                    roomId,
                    fileId,
                    token,
                    fullText: cleanedContent,
                    mode,
                    selection,
                    cursorPosition: {
                        lineNumber: currentAiLine,
                        column: currentAiCol,
                    },
                });
            }
            let finalCode = content;
            if (!isExplain) {
                // Clean trailing code block delimiters if any
                finalCode = finalCode.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```\s*$/, "");
            }
            io.to(roomId).emit("ai:edit:done", {
                roomId,
                fileId,
                fullText: finalCode,
                mode,
                selection,
                cursorPosition,
            });
        }
        catch (error) {
            if (error?.name === "AbortError" || abortController.signal.aborted) {
                console.log(`[AI Edit] Stream aborted in room ${roomId}`);
                io.to(roomId).emit("ai:stopped", { roomId, fileId });
            }
            else {
                console.error("AI Edit error:", error);
                io.to(roomId).emit("ai:edit:error", {
                    roomId,
                    fileId,
                    message: error?.message || "Failed to generate AI edit.",
                });
            }
        }
        finally {
            activeStreams.delete(roomId);
            await redis.del(lockKey);
            io.to(roomId).emit("ai:loading", false);
        }
    });
    // 3. Stop AI Streaming (Immediate Abort)
    socket.on("ai:stop", async ({ roomId }) => {
        if (!roomId)
            return;
        const controller = activeStreams.get(roomId);
        if (controller) {
            controller.abort();
            activeStreams.delete(roomId);
        }
        const lockKey = `ai:generating:${roomId}`;
        await redis.del(lockKey);
        io.to(roomId).emit("ai:stopped", { roomId });
        io.to(roomId).emit("ai:loading", false);
    });
    // 4. Collaborative AI Cursor Awareness
    socket.on("ai:cursor", ({ roomId, fileId, position, user, }) => {
        const roomKey = `${roomId}:${fileId}`;
        socket.to(roomKey).emit("ai:cursor", {
            roomId,
            fileId,
            position,
            user,
        });
    });
    // 5. Chat messages
    socket.on("messages", async ({ roomId, user, payload }) => {
        const members = await presence.getRoomMembers(roomId);
        const mentionedMembers = members.filter((m) => {
            const name = m.name.trim();
            const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            return new RegExp(`(^|\\s)@${escapedName}(?=\\s|$)`, "i").test(payload.prompt);
        });
        for (const mentioned of mentionedMembers) {
            io.to(roomId).emit("activity", {
                id: (0, node_crypto_1.randomUUID)(),
                type: "mention",
                message: `${user.name} mentioned ${mentioned.name} in chat`,
                time: new Date().toLocaleTimeString(),
            });
        }
        // Save normal chat message in Redis
        await chatStore.setHistory(roomId, payload.prompt, "user", user.id, user.name);
        io.to(roomId).emit("messages", {
            user,
            payload,
        });
    });
    // 6. Clear messages
    socket.on("clear:msg", async ({ roomId }) => {
        await chatStore.deleteHistory(roomId);
        io.to(roomId).emit("msg:cleared");
    });
}
//# sourceMappingURL=aiChat.js.map