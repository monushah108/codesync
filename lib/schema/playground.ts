import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { TAGS } from "@/components/constant/dashboard";

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

  tags: z
    .array(z.enum(TAGS))
    .max(3, "Maximum 3 tags allowed")
    .optional()
    .default([]),
});

export type PlaySchema = z.infer<typeof playSchema>;
