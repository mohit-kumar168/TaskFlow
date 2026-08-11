import prisma from "@/prisma/client";
import type {
	CreateProjectInput,
	UpdateColumnInput,
	UpdateProjectInput,
} from "./project.types";
import { ProjectRole } from "@/generated/prisma/enums";

export const createProject = async (
	workspaceId: string,
	ownerId: string,
	slug: string,
	key: string,
	data: CreateProjectInput,
) => {
	return await prisma.$transaction(async (tx) => {
		const project = await tx.project.create({
			data: {
				workspaceId,
				name: data.name,
				slug,
				key,
				description: data.description,
				iconUrl: data.iconUrl,
			},
		});

		await tx.projectMember.create({
			data: {
				projectId: project.id,
				userId: ownerId,
				role: ProjectRole.ADMIN,
			},
		});

		const board = await tx.board.create({
			data: {
				projectId: project.id,
				name: data.boardName,
			},
		});

		await tx.boardColumn.createMany({
			data: [
				{
					boardId: board.id,
					name: "Todo",
					position: 0,
				},
				{
					boardId: board.id,
					name: "In Progress",
					position: 1,
				},
				{
					boardId: board.id,
					name: "In Review",
					position: 2,
				},
				{
					boardId: board.id,
					name: "Done",
					position: 3,
				},
			],
		});
		return project;
	});
};

export const findProjectBySlug = async (
	workspaceId: string,
	memberId: string,
	slug: string,
) => {
	return await prisma.project.findFirst({
		where: {
			workspaceId,
			slug,
			isArchived: false,
			members: {
				some: {
					userId: memberId,
				},
			},
		},
	});
};

export const findProjectById = async (projectId: string) => {
	return await prisma.project.findUnique({
		where: {
			id: projectId,
		},
	});
};

export const fetchAllProjects = async (workspaceId: string) => {
	return await prisma.project.findMany({
		where: {
			workspaceId,
			isArchived: false,
		},
	});
};

export const updateProject = async (
	projectId: string,
	data: UpdateProjectInput,
) => {
	return await prisma.project.update({
		where: {
			id: projectId,
		},
		data: {
			name: data.name,
			description: data.description,
			iconUrl: data.iconUrl,
		},
	});
};

export const archiveProject = async (projectId: string) => {
	return await prisma.project.update({
		where: {
			id: projectId,
		},
		data: {
			isArchived: true,
		},
	});
};

export const createProjectMember = async (
	projectId: string,
	userId: string,
	role: ProjectRole,
) => {
	return await prisma.projectMember.create({
		data: {
			projectId,
			userId,
			role,
		},
	});
};

export const findProjectMemberByUserId = async (
	projectId: string,
	userId: string,
) => {
	return await prisma.projectMember.findUnique({
		where: {
			projectId_userId: {
				projectId,
				userId,
			},
		},
	});
};

export const findProjectMemberById = async (
	projectId: string,
	memberId: string,
) => {
	return await prisma.projectMember.findFirst({
		where: {
			id: memberId,
			projectId,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					avatarUrl: true,
				},
			},
		},
	});
};

export const fetchAllProjectMembers = async (projectId: string) => {
	return await prisma.projectMember.findMany({
		where: {
			projectId,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					avatarUrl: true,
				},
			},
		},
	});
};

export const updateProjectMemberRole = async (
	memberId: string,
	role: ProjectRole,
) => {
	return await prisma.projectMember.update({
		where: {
			id: memberId,
		},
		data: {
			role,
		},
	});
};

export const removeProjectMember = async (memberId: string) => {
	return await prisma.projectMember.delete({
		where: {
			id: memberId,
		},
	});
};

export const findBoardByProjectId = async (projectId: string) => {
	return await prisma.board.findUnique({
		where: {
			projectId,
		},
		include: {
			columns: {
				orderBy: {
					position: "asc",
				},
			},
		},
	});
};

export const updateBoard = async (boardId: string, name: string) => {
	return await prisma.board.update({
		where: {
			id: boardId,
		},
		data: {
			name,
		},
	});
};

export const createBoardColumn = async (
	boardId: string,
	name: string,
	color: string,
	position: number,
) => {
	return await prisma.boardColumn.create({
		data: {
			boardId,
			name,
			color,
			position,
		},
	});
};

export const fetchBoardColumns = async (boardId: string) => {
	return await prisma.boardColumn.findMany({
		where: {
			boardId,
		},
		orderBy: {
			position: "asc",
		},
	});
};

export const findBoardColumnById = async (
	boardId: string,
	columnId: string,
) => {
	return await prisma.boardColumn.findFirst({
		where: {
			id: columnId,
			boardId,
		},
	});
};

export const updateBoardColumn = async (
	columnId: string,
	data: UpdateColumnInput,
) => {
	return await prisma.boardColumn.update({
		where: {
			id: columnId,
		},
		data: {
			name: data.name,
			color: data.color,
		},
	});
};

export const deleteBoardColumn = async (columnId: string) => {
	return await prisma.boardColumn.delete({
		where: {
			id: columnId,
		},
	});
};
