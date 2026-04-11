import { z } from "zod";

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, { error: "Minimum name length is 3" })
    .max(20, { error: "Maximum name length is 20" })
    .refine((val) => /^[a-zA-Z0-9_]+$/.test(val), {
      error: "Name must only includes letter, numbers, and (_)",
    })
    .refine((val) => !val.startsWith("_"), {
      error: "Name can't start with (_)",
    })
    .refine((val) => !val.endsWith("_"), { error: "Name can't end with (_)" })
    .refine((val) => !val.includes("__"), {
      error: "Name can't includes (__)",
    })
    .optional(),
  password: z
    .string()
    .min(8, { error: "Minimum password length is 8" })
    .max(64, { error: "Maximum password length is 64" })
    .refine((val) => /[A-Z]/.test(val), {
      error: "Password must include at least a capital letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      error: "Password must include at least a lowercase letter",
    })
    .refine((val) => /\d/.test(val), {
      error: "Password must include numbers",
    })
    .refine((val) => /[!@#$%^&*()_+\[\]{}|;:',.<>/?`~\\-]/.test(val), {
      error: "Password must include at least a symbols",
    })
    .optional(),
});

export type UpdateUserProps = z.infer<typeof updateUserSchema>;
