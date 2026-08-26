import { z } from "zod";
import { SprintStatus } from "../../generated/prisma/enums";

export const createSprintSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Sprint name must be at least 2 characters.")
      .max(100, "Sprint name cannot exceed 100 characters."),

    goal: z
      .string()
      .trim()
      .max(500, "Sprint goal cannot exceed 500 characters.")
      .optional(),

    startDate: z
      .iso.datetime()
      .optional(),

    endDate: z
      .iso.datetime()
      .optional(),
  }),
});

export const completeSprintSchema = z.object({
  body: z
    .object({
      moveIncompleteTo: z.enum([
        "BACKLOG",
        "NEXT_SPRINT",
      ]),

      nextSprintId: z
        .string()
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.moveIncompleteTo === "NEXT_SPRINT" &&
        !data.nextSprintId
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["nextSprintId"],
          message:
            "Next sprint ID is required when moving issues to the next sprint.",
        });
      }
    }),
});

export const sprintStatusQuerySchema = z.object({
  query: z.object({
    status: z
      .enum(SprintStatus)
      .optional(),
  }),
});
