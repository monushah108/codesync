import { z } from "zod";
import sanitizeHtml from "sanitize-html";

const clean = (value: string) =>
  sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  });

export const playSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Room name must be at least 3 characters.")
    .max(15, "Room name must be at most 15 characters.")
    .transform(clean),
  type: z.enum(["public", "private"], {
    error: "Please select a room visibility.",
  }),

  duration: z.enum(["never", "24h", "7d"], {
    error: "Please select a room duration.",
  }),
});

export type PlaySchema = z.infer<typeof playSchema>;
