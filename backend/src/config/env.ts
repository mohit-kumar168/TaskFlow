import type { SignOptions } from "jsonwebtoken";
import z from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(8000),

  DATABASE_URL: z.string().min(1, "Database URL is required"),

  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),

  ACCESS_TOKEN_SECRET: z
    .string()
    .min(1, "ACCESS_TOKEN_SECRET is required"),

  ACCESS_TOKEN_EXPIRES_IN: z.custom<SignOptions["expiresIn"]>(),

  REFRESH_TOKEN_SECRET: z
    .string()
    .min(1, "REFRESH_TOKEN_SECRET is required"),

  REFRESH_TOKEN_EXPIRES_IN: z.custom<SignOptions["expiresIn"]>(),

  CLOUDINARY_CLOUD_NAME: z
    .string()
    .min(1, "CLOUDINARY_CLOUD_NAME is required"),

  CLOUDINARY_API_KEY: z
    .string()
    .min(1, "CLOUDINARY_API_KEY is required"),

  CLOUDINARY_API_SECRET: z
    .string()
    .min(1, "CLOUDINARY_API_SECRET is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables");

  console.table(
    parsedEnv.error.issues.map((issue) => ({
      variable: issue.path.join("."),
      Error: issue.message
    }))
  );
  process.exit(1);
}

const env = parsedEnv.data;

export default env;
