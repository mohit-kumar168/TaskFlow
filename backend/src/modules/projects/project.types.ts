import type { ProjectRole } from "@/generated/prisma/enums";

export interface CreateProjectInput {
  name: string;
  key: string;
  description?: string;
  iconUrl?: string;
  boardName?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  iconUrl?: string;
}

export interface AddProjectMemberInput {
  email: string;
  role?: ProjectRole;
}

export interface UpdateProjectMemberInput {
  email: string;
  role: ProjectRole;
}

export interface CreateColumnInput {
  name: string;
  color?: string;
}

export interface UpdateColumnInput {
  name?: string;
  color?: string;
}
