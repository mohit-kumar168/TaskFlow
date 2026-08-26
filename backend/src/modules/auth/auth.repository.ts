import { AuthProvider, type Prisma } from "@/generated/prisma/client";
import prisma from "../../prisma/client";
import type { UpdateProfileInput } from "./auth.types";

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
        providerAccountId: user.email,
        passwordHash,
      },
    });

    return user;
  });
};

export const updateRefreshToken = async (userId: string, hashedRefreshToken: string | null) => {
  return prisma.account.update({
    where: {
      userId_provider: {
        userId,
        provider: AuthProvider.CREDENTIALS,
      }
    },
    data: {
      hashedRefreshToken,
    },
  });
};

export const findCredentialsAccount = async (userId: string) => {
  return prisma.account.findUnique({
    where: {
      userId_provider: {
        userId,
        provider: AuthProvider.CREDENTIALS,
      },
    },
    include: {
      user: true,
    }
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

export const updateProfile = async (userId: string, data: UpdateProfileInput) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: data.name,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
    },
  });
};

export const removeUser = async (userId: string) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isActive: false,
    },
  });
};
