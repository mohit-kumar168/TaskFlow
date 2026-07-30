import type { SignOptions } from "jsonwebtoken";

const env = {
	NODE_ENV: process.env.NODE_ENV ?? "development",
	PORT: Number(process.env.PORT) || 8000,

	DATABASE_URL: process.env.DATABASE_URL!,
	BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,

	ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
	ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
	REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
	REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
}

export default env;
