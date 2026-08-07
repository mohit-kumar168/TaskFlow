import { AuthProvider, type Prisma } from "@/generated/prisma/client";
import prisma from "../../prisma/client";

export const findUserByEmail = async (email: string) => {
	return prisma.user.findUnique({
		where: {
			email,
		},
		include: {
			accounts: true,
		},
	});
};

export const findUserById = async (userId: string) => {
	return prisma.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			accounts: true,
		},
	});
};

export const createUserWithCredentials = async (data: Prisma.UserCreateInput, passwordHash: string) => {
	return prisma.$transaction(async (tx) => {
		const user = await tx.user.create({
			data: {
				name: data.name,
				email: data.email,
				bio: data.bio,
				avatarUrl: data.avatarUrl,
			},
		});

		await tx.account.create({
			data: {
				userId: user.id,
				provider: AuthProvider.CREDENTIALS,
				passwordHash,
			},
		});

		return user;
	});
};

export const updateRefreshToken = async (userId: string, hashedRefreshToken: string | null) => {
	return prisma.account.update({
		where: {

		},
		data: {
			hashedRefreshToken,
		},
	});
};

export const updatePassword = async (accountId: string, passwordHash: string) => {
	return prisma.account.update({
		where: {
			id: accountId,
		},
		data: {
			passwordHash,
		},
	});
};
