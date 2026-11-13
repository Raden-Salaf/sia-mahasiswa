// Data lengkap mahasiswa yang diterima dari backend.
export interface Mahasiswa {
  id: number;
  nim: string;
  nama_mahasiswa: string;
  jenis_kelamin: "L" | "P";
  tempat_lahir: string;
  tanggal_lahir: string;
  kelas: string;
  alamat: string;
  nama_ibu_kandung: string;
  no_hp_wali: string;
  keterangan: string | null;
  created_at?: string;
  updated_at?: string;
}

// Data yang dikirim ketika menambahkan mahasiswa.
// ID dan timestamp dibuat oleh database, bukan form.
export type MahasiswaInput = Omit<
  Mahasiswa,
  "id" | "created_at" | "updated_at"
>;

// Saat edit, semua field boleh tidak dikirim.
// Validasi minimal satu field tetap dilakukan backend.
export type MahasiswaUpdate = Partial<MahasiswaInput>;

// Bentuk respons API untuk daftar mahasiswa.
export interface MahasiswaListResponse {
  success: boolean;
  message: string;
  total: number | null;
  data: Mahasiswa[];
}

// Bentuk respons API untuk satu data mahasiswa.
export interface MahasiswaDetailResponse {
  success: boolean;
  message: string;
  data: Mahasiswa;
}
