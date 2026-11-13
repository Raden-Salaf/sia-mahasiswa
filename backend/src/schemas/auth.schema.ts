import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Format email tidak valid")
    .max(150, "Email maksimal 150 karakter"),

  password: z
    .string()
    .min(1, "Password wajib diisi")
    .max(72, "Password terlalu panjang"),
});

export type LoginInput = z.infer<typeof loginSchema>;
