import z from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at leas 3 characters.")
      .max(30, "Name cannot exceed 30 characters."),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email("Please provide a valid email address.")),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(12, "Password cannot exceed 12 characters"),

    bio: z
      .string()
      .max(250, "Bio cannot exceed 250 characters.")
      .optional(),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email("Please provide a valid email address.")),

    password: z
      .string()
      .min(8, "Password is required."),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string()
      .min(8, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "New password must be at leas 8 characters.")
      .max(12, "New password cannot exceed 12 characters."),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at leas 3 characters.")
      .max(30, "Name cannot exceed 30 characters.")
      .optional(),

    bio: z
      .string()
      .max(250, "Bio cannot exceed 250 characters.")
      .optional(),
  })
});
