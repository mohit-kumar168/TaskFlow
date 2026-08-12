import { api } from "./axios";

export interface ProjectProps {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  key: string;
  description: string;
  iconUrl?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;

  _count: {
    members: number;
    issues: number;
  };
}

export interface CreateProjectProps {
  name: string;
  key: string;
  description?: string;
  iconUrl?: string;
  boardName: string;
}

export interface BoardProps {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardColumnProps {
  id: string;
  boardId: string;
  name: string;
  color?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardColumnProps {
  name: string;
  color?: string;
}

export interface UpdateBoardColumnProps {
  name?: string;
  color?: string;
}

export const createProject = async (
  organizationSlug: string,
  workspaceSlug: string,
  data: CreateProjectProps,
) => {
  return api.post(
    `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects`,
    data,
  );
};

export const getProjects = async (
  organizationSlug: string,
  workspaceSlug: string,
) => {
  return api.get(
    `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects`,
  );
};

export const getProject = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
) => {
  return api.get(
    `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}`,
  );
};

export const getBoard = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
) => {
  return api.get(
    `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}/board`,
  );
};

export const updateBoard = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  name: string,
) => {
  return api.patch(
    `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}/board`,
    { name },
  );
};

export const createBoardColumn = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  data: CreateBoardColumnProps,
) => {
  return api.post(
    `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}/board/columns`,
    data,
  );
};

export const getBoardColumns = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
) => {
  return api.get(
    `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}/board/columns`,
  );
};

export const getBoardColumn = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  columnId: string,
) => {
  return api.get(
	`/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}/board/columns/${columnId}`,
  );
};

export const updateBoardColumn = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  columnId: string,
  data: UpdateBoardColumnProps
) => {
  return api.patch(
    `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}/board/columns/${columnId}`,
    data,
  );
};

export const deleteBoardColumn = async (
  organizationSlug: string,
  workspaceSlug: string,
  projectSlug: string,
  columnId: string
) => {
  return api.delete(
    `/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${projectSlug}/board/columns/${columnId}`,
  );
};
