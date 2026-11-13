import { z } from "zod";

/**
 * Schema untuk membuat akun mahasiswa.
 *
 * id_mhs  : ID mahasiswa yang akan diberikan akun.
 * email   : Email untuk login.
 * password: Password awal akun.
 *
 * Role otomatis diberikan sebagai mahasiswa oleh backend.
 */
export const createUserSchema = z.object({
  id_mhs: z
    .number()
    .int("ID mahasiswa harus berupa bilangan bulat")
    .positive("ID mahasiswa harus lebih dari 0"),

  email: z
    .string()
    .trim()
    .email("Format email tidak valid")
    .max(150, "Email maksimal 150 karakter"),

  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(72, "Password maksimal 72 karakter"),
});

/**
 * Schema untuk memperbarui akun.
 *
 * Email dan password dapat diperbarui.
 * id_mhs dan role tidak boleh diubah melalui endpoint ini.
 */
export const updateUserSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Format email tidak valid")
      .max(150, "Email maksimal 150 karakter")
      .optional(),

    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .max(72, "Password maksimal 72 karakter")
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "Minimal satu field harus diisi untuk diperbarui."
  );

/**
 * Schema khusus untuk perubahan role.
 */
export const updateUserRoleSchema = z.object({
  role_id: z
    .number()
    .int("Role ID harus berupa bilangan bulat")
    .positive("Role ID harus lebih dari 0"),
});

// TypeScript types berdasarkan schema Zod
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
