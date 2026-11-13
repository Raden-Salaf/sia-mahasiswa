import api from "./api";

import type {
  Mahasiswa,
  MahasiswaInput,
  MahasiswaUpdate,
  MahasiswaListResponse,
  MahasiswaDetailResponse,
} from "../types/mahasiswa";

// Semua komunikasi HTTP untuk modul mahasiswa
// dikumpulkan dalam satu service.
export const mahasiswaService = {
  // Mengambil seluruh data mahasiswa.
  // Parameter search digunakan untuk pencarian NIM atau nama.
  async getAll(
    search = ""
  ): Promise<MahasiswaListResponse> {
    const response = await api.get<MahasiswaListResponse>(
      "/mahasiswa",
      {
        params: { search },
      }
    );

    return response.data;
  },

  // Mengambil detail mahasiswa berdasarkan ID.
  async getById(
    id: number
  ): Promise<MahasiswaDetailResponse> {
    const response = await api.get<MahasiswaDetailResponse>(
      `/mahasiswa/${id}`
    );

    return response.data;
  },

  // Menambahkan mahasiswa baru.
  async create(
    payload: MahasiswaInput
  ): Promise<{
    success: boolean;
    message: string;
    data: Mahasiswa;
  }> {
    const response = await api.post(
      "/mahasiswa",
      payload
    );

    return response.data;
  },

  // Memperbarui data mahasiswa.
  async update(
    id: number,
    payload: MahasiswaUpdate
  ): Promise<{
    success: boolean;
    message: string;
    data: Mahasiswa;
  }> {
    const response = await api.put(
      `/mahasiswa/${id}`,
      payload
    );

    return response.data;
  },

  // Menghapus mahasiswa berdasarkan ID.
  async delete(
    id: number
  ): Promise<{
    success: boolean;
    message: string;
    data: Mahasiswa;
  }> {
    const response = await api.delete(
      `/mahasiswa/${id}`
    );

    return response.data;
  },
};
