import env from "@/config/env";
import bcrypt from "bcrypt"

export const generateHash = async (password: string): Promise<string> => {
	return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
}

export const compareHash = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
	return bcrypt.compare(plainPassword, hashedPassword);
}


