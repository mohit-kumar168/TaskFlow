import type { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import apiResponse from "@/utils/apiResponse";
import apiError from "@/utils/apiError";
import prisma from "@/prisma/client";
import { comparePassword, hashPassword } from "@/utils/password";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@/utils/jwt";
import { ACCESS_TOKEN_COOKIE_OPTIONS, ACCOUNT_TYPE, AUTH_PROVIDER, REFRESH_TOKEN_COOKIE_OPTIONS } from "@/constants/auth.constants";

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		throw new apiError(400, "All fields are required");
	}

	const existingUser = await prisma.user.findUnique({
		where: {
			email
		}
	})

	if (existingUser) {
		throw new apiError(400, "User already exists");
	}

	const hashedPassword = await hashPassword(password);

	const result = await prisma.$transaction(async (tx) => {
		const user = await tx.user.create({
			data: {
				name,
				email
			},
		})

		const account = await tx.account.create({
			data: {
				userId: user.id,
				passwordHash: hashedPassword,
				type: ACCOUNT_TYPE.CREDENTIALS,
				provider: AUTH_PROVIDER.CREDENTIALS,
				providerAccountId: email
			}
		})

		return { user, account };
	});

	return res.status(201).json(
		new apiResponse(
			"User registered successfully",
			{
				user: result.user,
			}
		)
	);
})


export const loginUser = asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new apiError(400, "All fields are required");
	}

	const user = await prisma.user.findUnique({
		where: {
			email
		},
	});

	if (!user) {
		throw new apiError(400, "User doesn't exist");
	}

	const account = await prisma.account.findUnique({
		where: {
			provider_providerAccountId: {
				provider: AUTH_PROVIDER.CREDENTIALS,
				providerAccountId: email
			}
		},
		include: {
			user: true
		}
	})

	if (!account?.passwordHash) {
		throw new apiError(400, "Invalid credentials");
	}

	const isPasswordCorrect = await comparePassword(password, account.passwordHash);
	if (!isPasswordCorrect) {
		throw new apiError(400, "Invalid credentials");
	}

	const accessToken = generateAccessToken(account.user.id);
	const refreshToken = generateRefreshToken(account.user.id);

	const hashedRefreshToken = await hashPassword(refreshToken);

	await prisma.account.update({
		where: {
			id: account.id
		},
		data: {
			hashedRefreshToken,
		}
	});

	res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
	res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

	return res.status(200).json(
		new apiResponse(
			"Logged in successfully",
			{
				user: {
					id: account.user.id,
					name: account.user.name,
					email: account.user.email,
				},
			},
		)
	);

})

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) {
		throw new apiError(401, "Unauthorized request");
	}

	const payload = verifyRefreshToken(refreshToken);
	const account = await prisma.account.findFirst({
		where: {
			userId: payload.id,
			provider: AUTH_PROVIDER.CREDENTIALS
		},
		include: {
			user: true
		}
	});

	if (!account?.hashedRefreshToken) {
		throw new apiError(401, "Unauthorized request");
	}

	const isValid = await comparePassword(refreshToken, account?.hashedRefreshToken);
	if (!isValid) {
		throw new apiError(401, "Unauthorized request");
	}

	const newAccessToken = generateAccessToken(account.user.id);
	const newRefreshToken = generateRefreshToken(account.user.id);

	const hashedRefreshToken = await hashPassword(newRefreshToken);

	await prisma.account.update({
		where: {
			id: account.id
		},
		data: {
			hashedRefreshToken,
		}
	})

	res.cookie("accessToken", newAccessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
	res.cookie("refreshToken", newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

	return res.status(200).json(
		new apiResponse(
			"Refresh token updated successfully",
			{
				user: {
					id: account.user.id,
					name: account.user.name,
					email: account.user.email,
				}
			}
		)
	);
})

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
	await prisma.account.update({
		where: {
			provider_providerAccountId: {
				provider: AUTH_PROVIDER.CREDENTIALS,
				providerAccountId: req.user!.email
			},
		},
		data: {
			hashedRefreshToken: null
		}
	})

	res.clearCookie("accessToken", ACCESS_TOKEN_COOKIE_OPTIONS);
	res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);

	return res.status(200).json(
		new apiResponse("Logged out successfully", null)
	);
})

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
	return res.status(200).json(
		new apiResponse("User fetched successfully", req.user)
	);
})

