export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  uuid: string;
  email: string;
  role: "super_admin" | "mahasiswa";
  id_mhs: number;
  nim: string;
  nama_mahasiswa: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
  };
}
