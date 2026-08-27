import { z } from "zod";

export const commentSchema = z.object({
  body: z.object({
    content: z
      .string()
      .trim()
      .min(1, "Comment can't be empty")
      .max(1000, "Comment can't exceed 1000 characters"),
  }),
});
