import { z } from "zod";

// Schema untuk memvalidasi data mahasiswa yang dikirim ke API.
export const mahasiswaSchema = z.object({
  // NIM wajib diisi dan maksimal 20 karakter.
  nim: z.string().trim().min(1, "NIM wajib diisi").max(20),

  // Nama mahasiswa wajib diisi.
  nama_mahasiswa: z.string().trim().min(1, "Nama mahasiswa wajib diisi").max(150),

  // Jenis kelamin hanya menerima L atau P.
  jenis_kelamin: z.enum(["L", "P"]),

  // Tempat lahir wajib diisi.
  tempat_lahir: z.string().trim().min(1).max(100),

  // Tanggal lahir harus menggunakan format YYYY-MM-DD.
  tanggal_lahir: z.iso.date("Tanggal lahir harus berformat YYYY-MM-DD"),

  // Kelas atau rombel mahasiswa.
  kelas: z.string().trim().min(1).max(50),

  // Alamat mahasiswa.
  alamat: z.string().trim().min(1, "Alamat wajib diisi"),

  // Nama ibu kandung.
  nama_ibu_kandung: z.string().trim().min(1).max(150),

  // Nomor HP orang tua atau wali.
  no_hp_wali: z.string().trim().min(8).max(20),

  // Keterangan bersifat opsional.
  keterangan: z.string().nullable().optional(),
});

// Schema khusus untuk memperbarui data.
// Semua field boleh tidak dikirim, tetapi minimal satu harus ada.
export const updateMahasiswaSchema = mahasiswaSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Minimal satu field harus diisi untuk diperbarui."
  );

// Menghasilkan tipe TypeScript berdasarkan schema.
export type MahasiswaInput = z.infer<typeof mahasiswaSchema>;
