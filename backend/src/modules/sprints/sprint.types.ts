import type { SprintStatus } from "../../generated/prisma/enums";

export interface CreateSprintInput {
  name: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
}

export interface CompleteSprintInput {
  moveIncompleteTo: "BACKLOG" | "NEXT_SPRINT";
  nextSprintId?: string;
}

export interface SprintFilters {
  status?: SprintStatus;
}
