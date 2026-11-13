import api from "./api";

import type {
  CreateUserPayload,
  UpdateUserPayload,
  UpdateUserRolePayload,
  UserDetailResponse,
  UserListResponse,
  UserMutationResponse,
} from "../types/user";

/**
 * Service untuk seluruh kebutuhan Manajemen Pengguna.
 *
 * Base URL sudah diatur di src/services/api.ts.
 * Karena itu endpoint cukup ditulis /users,
 * bukan /api/users.
 */
export const userService = {
  /**
   * Mengambil seluruh akun pengguna.
   *
   * includeDeleted = false:
   * Hanya mengambil akun yang masih aktif.
   *
   * includeDeleted = true:
   * Mengambil akun aktif dan akun yang sudah dinonaktifkan.
   */
  async getAll(includeDeleted = false): Promise<UserListResponse> {
    const response = await api.get<UserListResponse>("/users", {
      params: includeDeleted
        ? { include_deleted: "true" }
        : undefined,
    });

    return response.data;
  },

  /**
   * Mengambil detail akun berdasarkan UUID.
   */
  async getById(
    uuid: string,
    includeDeleted = false
  ): Promise<UserDetailResponse> {
    const response = await api.get<UserDetailResponse>(
      `/users/${uuid}`,
      {
        params: includeDeleted
          ? { include_deleted: "true" }
          : undefined,
      }
    );

    return response.data;
  },

  /**
   * Membuat akun pengguna baru.
   */
  async create(
    payload: CreateUserPayload
  ): Promise<UserMutationResponse> {
    const response = await api.post<UserMutationResponse>(
      "/users",
      payload
    );

    return response.data;
  },

  /**
   * Memperbarui email dan/atau password akun.
   */
  async update(
    uuid: string,
    payload: UpdateUserPayload
  ): Promise<UserMutationResponse> {
    const response = await api.put<UserMutationResponse>(
      `/users/${uuid}`,
      payload
    );

    return response.data;
  },

  /**
   * Mengubah role pengguna.
   *
   * 1 = super_admin
   * 2 = mahasiswa
   */
  async updateRole(
    uuid: string,
    payload: UpdateUserRolePayload
  ): Promise<UserDetailResponse> {
    const response = await api.patch<UserDetailResponse>(
      `/users/${uuid}/role`,
      payload
    );

    return response.data;
  },

  /**
   * Menonaktifkan akun dengan mekanisme soft delete.
   * Data akun tidak benar-benar dihapus dari database.
   */
  async delete(uuid: string): Promise<UserDetailResponse> {
    const response = await api.delete<UserDetailResponse>(
      `/users/${uuid}`
    );

    return response.data;
  },
};
