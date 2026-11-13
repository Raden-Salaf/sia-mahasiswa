import api from "./api";

import type {
  LoginPayload,
  LoginResponse,
  MeResponse,
} from "../types/auth";

export const authService = {
  // Login pengguna
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      "/auth/login",
      payload
    );

    return response.data;
  },

  // Validasi sesi pengguna
  async me(): Promise<MeResponse> {
    const response = await api.get<MeResponse>(
      "/auth/me"
    );

    return response.data;
  },

  // Logout pengguna
  logout() {
    sessionStorage.removeItem("sia_token");
    sessionStorage.removeItem("sia_user");
  },
};
