import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../../components/Sidebar";
import MahasiswaFormModal from "../../components/mahasiswa/MahasiswaFormModal";

import { mahasiswaService } from "../../services/mahasiswa.service";
import { alertService } from "../../services/alert.service";

import type {
  Mahasiswa,
  MahasiswaInput,
} from "../../types/mahasiswa";

function MahasiswaList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Menyimpan daftar mahasiswa dari API.
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);

  // Mengelola input pencarian.
  const [search, setSearch] = useState("");

  // Status loading ketika mengambil data.
  const [isLoading, setIsLoading] = useState(true);

  // Status ketika menyimpan form.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pesan error dari API.
  const [errorMessage, setErrorMessage] = useState("");

  // Mengontrol tampilan modal.
  const [isFormOpen, setIsFormOpen] = useState(false);

  // null berarti tambah, sedangkan berisi data berarti edit.
  const [editingMahasiswa, setEditingMahasiswa] =
    useState<Mahasiswa | null>(null);

  // Mengambil data mahasiswa dari backend.
  const fetchMahasiswa = useCallback(async (keyword = "") => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await mahasiswaService.getAll(keyword);

      setMahasiswa(response.data);
    } catch (error: unknown) {
      let message = "Gagal mengambil data mahasiswa.";

      if (axios.isAxiosError<{ message?: string }>(error)) {
        message = error.response?.data?.message || message;
      }

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mengambil data pertama kali ketika halaman dibuka.
  useEffect(() => {
    void fetchMahasiswa();
  }, [fetchMahasiswa]);

  // Menjalankan pencarian.
  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    void fetchMahasiswa(search.trim());
  };

  // Membuka modal tambah.
  const handleAdd = () => {
    setEditingMahasiswa(null);
    setIsFormOpen(true);
  };

  // Membuka modal edit dengan data yang dipilih.
  const handleEdit = (item: Mahasiswa) => {
    setEditingMahasiswa(item);
    setIsFormOpen(true);
  };

  // Menutup modal.
  const handleCloseForm = () => {
    if (isSubmitting) return;

    setIsFormOpen(false);
    setEditingMahasiswa(null);
  };

  // Menyimpan data baru atau perubahan data.
  const handleFormSubmit = async (payload: MahasiswaInput) => {
    try {
      setIsSubmitting(true);

      alertService.loading(
        editingMahasiswa
          ? "Memperbarui data mahasiswa..."
          : "Menambahkan mahasiswa..."
      );

      if (editingMahasiswa) {
        // Mode edit: kirim PUT ke backend.
        await mahasiswaService.update(
          editingMahasiswa.id,
          payload
        );
      } else {
        // Mode tambah: kirim POST ke backend.
        await mahasiswaService.create(payload);
      }

      alertService.close();

      setIsFormOpen(false);
      setEditingMahasiswa(null);

      await alertService.success(
        "Berhasil",
        editingMahasiswa
          ? "Data mahasiswa berhasil diperbarui."
          : "Mahasiswa baru berhasil ditambahkan."
      );

      // Perbarui tabel setelah penyimpanan berhasil.
      await fetchMahasiswa(search.trim());
    } catch (error: unknown) {
      alertService.close();

      let message = "Gagal menyimpan data mahasiswa.";

      if (axios.isAxiosError<{ message?: string }>(error)) {
        message = error.response?.data?.message || message;
      }

      await alertService.error("Penyimpanan gagal", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Menghapus mahasiswa.
  const handleDelete = async (item: Mahasiswa) => {
    const confirmation = await alertService.confirm(
      "Hapus data mahasiswa?",
      `Data ${item.nama_mahasiswa} dengan NIM ${item.nim} akan dihapus permanen.`
    );

    if (!confirmation.isConfirmed) return;

    try {
      alertService.loading("Menghapus data mahasiswa...");

      await mahasiswaService.delete(item.id);

      alertService.close();

      await alertService.success(
        "Berhasil",
        "Data mahasiswa berhasil dihapus."
      );

      await fetchMahasiswa(search.trim());
    } catch (error: unknown) {
      alertService.close();

      let message = "Gagal menghapus data mahasiswa.";

      if (axios.isAxiosError<{ message?: string }>(error)) {
        message = error.response?.data?.message || message;
      }

      await alertService.error("Penghapusan gagal", message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <main className="min-h-screen min-w-0 lg:ml-[260px]">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu navigasi"
              aria-expanded={sidebarOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 lg:hidden"
            >
              ☰
            </button>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Halaman / Data Mahasiswa
              </p>

              <h1 className="mt-1 text-lg font-extrabold text-slate-900">
                Data Mahasiswa
              </h1>
            </div>
          </div>

          <span className="hidden rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 sm:inline-flex">
            Administrator
          </span>
        </header>

        {/* PAGE CONTENT */}
        <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
          {/* PAGE TITLE */}
          <section className="mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              Manajemen Data Mahasiswa
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Lihat, cari, tambah, dan kelola data mahasiswa
              yang terdaftar dalam sistem.
            </p>
          </section>

          {/* TABLE CARD */}
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            {/* CARD HEADER */}
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900">
                  Daftar Mahasiswa
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Data diambil langsung dari database.
                </p>
              </div>

              {/* TOMBOL TAMBAH */}
              <button
                type="button"
                onClick={handleAdd}
                className="rounded-xl bg-red-700 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-red-900/10 transition hover:bg-red-800"
              >
                + Tambah Mahasiswa
              </button>
            </div>

            {/* SEARCH */}
            <div className="border-b border-slate-100 p-5">
              <form
                onSubmit={handleSearch}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari berdasarkan NIM atau nama mahasiswa..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl bg-red-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-800 disabled:opacity-50"
                >
                  Cari
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    void fetchMahasiswa();
                  }}
                  disabled={isLoading}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Reset
                </button>
              </form>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4">No.</th>
                    <th className="px-5 py-4">NIM</th>
                    <th className="px-5 py-4">Nama Mahasiswa</th>
                    <th className="px-5 py-4">Jenis Kelamin</th>
                    <th className="px-5 py-4">Kelas</th>
                    <th className="px-5 py-4 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {/* LOADING */}
                  {isLoading && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-slate-500"
                      >
                        Sedang mengambil data mahasiswa...
                      </td>
                    </tr>
                  )}

                  {/* ERROR */}
                  {!isLoading && errorMessage && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-red-600"
                      >
                        {errorMessage}
                      </td>
                    </tr>
                  )}

                  {/* DATA KOSONG */}
                  {!isLoading &&
                    !errorMessage &&
                    mahasiswa.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-12 text-center text-slate-400"
                        >
                          Data mahasiswa tidak ditemukan.
                        </td>
                      </tr>
                    )}

                  {/* DATA MAHASISWA */}
                  {!isLoading &&
                    !errorMessage &&
                    mahasiswa.map((item, index) => (
                      <tr
                        key={item.id}
                        className="transition hover:bg-red-50/40"
                      >
                        <td className="px-5 py-4 text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4 font-bold text-slate-700">
                          {item.nim}
                        </td>

                        <td className="px-5 py-4 font-semibold text-slate-800">
                          {item.nama_mahasiswa}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {item.jenis_kelamin === "L"
                            ? "Laki-laki"
                            : "Perempuan"}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                            {item.kelas}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-center gap-2">
                            {/* EDIT */}
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                            >
                              Edit
                            </button>

                            {/* DELETE */}
                            <button
                              type="button"
                              onClick={() => void handleDelete(item)}
                              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER */}
            {!isLoading && !errorMessage && (
              <div className="border-t border-slate-100 px-5 py-4">
                <p className="text-xs text-slate-500">
                  Menampilkan{" "}
                  <strong className="text-slate-800">
                    {mahasiswa.length}
                  </strong>{" "}
                  data mahasiswa pada hasil pencarian ini.
                </p>
              </div>
            )}
          </section>

          {/* FOOTER */}
          <footer className="mt-10 border-t border-slate-200 py-6 text-center">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} SIA Mahasiswa.
              Sistem Informasi Administrasi Akademik.
            </p>
          </footer>
        </div>
      </main>

      {/* FORM MODAL */}
      {isFormOpen && (
        <MahasiswaFormModal
          key={editingMahasiswa?.id ?? "new"}
          initialData={editingMahasiswa}
          isSubmitting={isSubmitting}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

export default MahasiswaList;
