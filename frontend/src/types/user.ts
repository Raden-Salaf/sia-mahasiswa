/**
 * Informasi pengguna yang tercatat pada kolom audit.
 * Contohnya: siapa yang membuat, mengubah, atau menonaktifkan akun.
 */
export interface UserAuditActor {
  uuid: string;
  nama: string | null;
  email: string;
  role: string;
}

/**
 * Data akun pengguna dari endpoint GET /api/users.
 */
export interface UserAccount {
  uuid: string;
  id_mhs: number;
  nim: string;
  nama_mahasiswa: string;
  email: string;
  role_id: number;
  role_name: "super_admin" | "mahasiswa";

  created_at: string;
  created_by: UserAuditActor | null;

  updated_at: string | null;
  updated_by: UserAuditActor | null;

  deleted_at: string | null;
  deleted_by: UserAuditActor | null;
}

/**
 * Respons daftar akun pengguna.
 */
export interface UserListResponse {
  success: boolean;
  message: string;
  total: number;
  data: UserAccount[];
}

/**
 * Data yang dikirim saat membuat akun.
 * Role tidak dikirim karena backend otomatis
 * memberikan role mahasiswa.
 */
export interface CreateUserPayload {
  id_mhs: number;
  email: string;
  password: string;
}

/**
 * Data yang dikirim saat memperbarui akun.
 * Password boleh dikosongkan jika tidak ingin diubah.
 */
export interface UpdateUserPayload {
  email?: string;
  password?: string;
}

/**
 * Data yang dikirim saat mengubah role akun.
 */
export interface UpdateUserRolePayload {
  role_id: number;
}

/**
 * Bentuk respons umum untuk operasi tambah dan edit.
 */
export interface UserMutationResponse {
  success: boolean;
  message: string;
  data: {
    uuid: string;
    id_mhs: number;
    email: string;
    role_id: number;
    created_at?: string;
    created_by?: UserAuditActor | null;
    updated_at?: string;
    updated_by?: UserAuditActor | null;
  };
}

/**
 * Respons untuk operasi yang mengembalikan detail akun.
 */
export interface UserDetailResponse {
  success: boolean;
  message: string;
  data: UserAccount;
}
