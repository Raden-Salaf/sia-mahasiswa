import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import Sidebar from "../../components/Sidebar";
import UserFormModal from "../../components/users/UserFormModal";
import UserEditModal from "../../components/users/UserEditModal";
import UserRoleModal from "../../components/users/UserRoleModal";

import { useAuth } from "../../contexts/AuthContext";

import { userService } from "../../services/user.service";
import { mahasiswaService } from "../../services/mahasiswa.service";
import { alertService } from "../../services/alert.service";

import type {
  UserAccount,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateUserRolePayload,
} from "../../types/user";
import type { Mahasiswa } from "../../types/mahasiswa";

type AccountStatusFilter = "all" | "active" | "inactive";

function UserList() {
  const { user: currentUser } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [availableMahasiswa, setAvailableMahasiswa] = useState<Mahasiswa[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<AccountStatusFilter>("all");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [selectedRoleUser, setSelectedRoleUser] =
    useState<UserAccount | null>(null);

  /**
   * Mengambil seluruh akun dari backend,
   * termasuk akun yang sudah dinonaktifkan.
   */
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await userService.getAll(true);
      setUsers(response.data);
    } catch (error: unknown) {
      let message = "Gagal mengambil data pengguna.";

      if (axios.isAxiosError<{ message?: string }>(error)) {
        message = error.response?.data?.message || message;
      }

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  // Menghitung ringkasan akun.
  const accountSummary = useMemo(() => {
    const active = users.filter(
      (user) => user.deleted_at === null
    ).length;

    const inactive = users.filter(
      (user) => user.deleted_at !== null
    ).length;

    return {
      total: users.length,
      active,
      inactive,
    };
  }, [users]);

  // Pencarian dan filter status akun.
  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return users.filter((user) => {
      const nama = (user.nama_mahasiswa ?? "").toLowerCase();
      const nim = (user.nim ?? "").toLowerCase();
      const email = (user.email ?? "").toLowerCase();

      const matchesSearch =
        nama.includes(keyword) ||
        nim.includes(keyword) ||
        email.includes(keyword);

      const isActive = user.deleted_at === null;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "inactive" && !isActive);

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  // Format tanggal untuk tampilan Indonesia.
  const formatDate = (value: string | null) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  /**
   * Membuka modal tambah akun.
   */
  const handleAdd = async () => {
    try {
      alertService.loading("Memeriksa mahasiswa yang tersedia...");

      const [mahasiswaResponse, usersResponse] = await Promise.all([
        mahasiswaService.getAll(),
        userService.getAll(true),
      ]);

      const existingStudentIds = new Set(
        usersResponse.data.map((user) => user.id_mhs)
      );

      const filteredMahasiswa = mahasiswaResponse.data.filter(
        (item) => !existingStudentIds.has(item.id)
      );

      setAvailableMahasiswa(filteredMahasiswa);
      setIsCreateModalOpen(true);

      alertService.close();
    } catch (error: unknown) {
      alertService.close();

      let message = "Gagal mengambil data mahasiswa.";

      if (axios.isAxiosError<{ message?: string }>(error)) {
        message = error.response?.data?.message || message;
      }

      await alertService.error("Gagal membuka form", message);
    }
  };

  /**
   * Membuat akun baru.
   */
  const handleCreateUser = async (payload: CreateUserPayload) => {
    try {
      setIsSubmitting(true);
      alertService.loading("Membuat akun pengguna...");

      await userService.create(payload);

      alertService.close();
      setIsCreateModalOpen(false);

      await alertService.success(
        "Akun berhasil dibuat",
        "Akun mahasiswa berhasil ditambahkan ke sistem."
      );

      await fetchUsers();
    } catch (error: unknown) {
      alertService.close();

      let message = "Gagal membuat akun pengguna.";

      if (axios.isAxiosError<{ message?: string }>(error)) {
        message = error.response?.data?.message || message;
      }

      await alertService.error("Pembuatan akun gagal", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Membuka modal edit akun.
   */
  const handleEdit = (user: UserAccount) => {
    if (user.deleted_at !== null) return;

    setSelectedUser(user);
  };

  /**
   * Mengirim perubahan email atau password.
   */
  const handleUpdateUser = async (payload: UpdateUserPayload) => {
    if (!selectedUser) return;

    try {
      setIsSubmitting(true);
      alertService.loading("Menyimpan perubahan akun...");

      await userService.update(selectedUser.uuid, payload);

      alertService.close();
      setSelectedUser(null);

      await alertService.success(
        "Akun berhasil diperbarui",
        "Informasi akun pengguna berhasil diperbarui."
      );

      await fetchUsers();
    } catch (error: unknown) {
      alertService.close();

      let message = "Gagal memperbarui akun pengguna.";

      if (axios.isAxiosError<{ message?: string }>(error)) {
        message = error.response?.data?.message || message;
      }

      await alertService.error("Perubahan akun gagal", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Membuka modal ubah role.
   *
   * Akun sendiri tidak boleh diubah role-nya.
   */
  const handleOpenRoleModal = (user: UserAccount) => {
    if (user.deleted_at !== null) return;

    if (user.uuid === currentUser?.uuid) {
      return;
    }

    setSelectedRoleUser(user);
  };

  /**
   * Mengubah role akun melalui endpoint PATCH.
   */
  const handleUpdateRole = async (payload: UpdateUserRolePayload) => {
    if (!selectedRoleUser) return;

    // Pemeriksaan ulang sebelum mengirim permintaan.
    if (selectedRoleUser.uuid === currentUser?.uuid) {
      await alertService.error(
        "Aksi tidak diizinkan",
        "Anda tidak dapat mengubah role akun sendiri."
      );
      return;
    }

    const newRoleName =
      payload.role_id === 1 ? "Super Admin" : "Mahasiswa";

    // Minta konfirmasi sebelum mengubah hak akses.
    const confirmation = await alertService.confirm(
      "Konfirmasi Perubahan Role",
      `Apakah Anda yakin ingin mengubah role ${selectedRoleUser.nama_mahasiswa} menjadi ${newRoleName}?`
    );

    if (!confirmation.isConfirmed) return;

    try {
      setIsSubmitting(true);
      alertService.loading("Memperbarui role akun...");

      await userService.updateRole(selectedRoleUser.uuid, payload);

      alertService.close();
      setSelectedRoleUser(null);

      await alertService.success(
        "Role berhasil diperbarui",
        `Role akun berhasil diubah menjadi ${newRoleName}.`
      );

      await fetchUsers();
    } catch (error: unknown) {
      alertService.close();

      let message = "Gagal mengubah role akun.";

      if (axios.isAxiosError<{ message?: string }>(error)) {
        message = error.response?.data?.message || message;
      }

      await alertService.error("Perubahan role gagal", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Menutup modal tambah akun.
  const handleCloseCreateModal = () => {
    if (isSubmitting) return;

    setIsCreateModalOpen(false);
    setAvailableMahasiswa([]);
  };

  // Menutup modal edit akun.
  const handleCloseEditModal = () => {
    if (isSubmitting) return;

    setSelectedUser(null);
  };

  // Menutup modal ubah role.
  const handleCloseRoleModal = () => {
    if (isSubmitting) return;

    setSelectedRoleUser(null);
  };

  // Memuat ulang daftar akun.
  const handleRefresh = async () => {
    await fetchUsers();

    await alertService.info(
      "Data diperbarui",
      "Daftar pengguna telah dimuat ulang dari server."
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

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
                Halaman / Manajemen Pengguna
              </p>

              <h1 className="mt-1 text-lg font-extrabold text-slate-900">
                Manajemen Pengguna
              </h1>
            </div>
          </div>

          <span className="hidden rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 sm:inline-flex">
            Administrator
          </span>
        </header>

        <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
          {/* PAGE TITLE */}
          <section className="mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              Manajemen Akun Pengguna
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Lihat dan kelola akun pengguna yang terdaftar
              dalam sistem administrasi mahasiswa.
            </p>
          </section>

          {/* SUMMARY */}
          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total Akun
              </p>
              <p className="mt-3 text-3xl font-extrabold text-slate-900">
                {accountSummary.total}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Akun Aktif
              </p>
              <p className="mt-3 text-3xl font-extrabold text-emerald-600">
                {accountSummary.active}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Akun Nonaktif
              </p>
              <p className="mt-3 text-3xl font-extrabold text-red-600">
                {accountSummary.inactive}
              </p>
            </div>
          </section>

          {/* TABLE CARD */}
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900">
                  Daftar Akun Pengguna
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Informasi akun diambil langsung dari database.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void handleAdd()}
                  className="rounded-xl bg-red-700 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-red-900/10 transition hover:bg-red-800"
                >
                  + Tambah Akun
                </button>

                <button
                  type="button"
                  onClick={() => void handleRefresh()}
                  disabled={isLoading}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                >
                  ↻ Muat Ulang
                </button>
              </div>
            </div>

            {/* SEARCH AND FILTER */}
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 md:flex-row">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama, NIM, atau email..."
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as AccountStatusFilter
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4">No.</th>
                    <th className="px-5 py-4">Mahasiswa</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Tanggal Dibuat</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {isLoading && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                        Sedang mengambil data pengguna...
                      </td>
                    </tr>
                  )}

                  {!isLoading && errorMessage && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-red-600">
                        {errorMessage}
                      </td>
                    </tr>
                  )}

                  {!isLoading && !errorMessage && filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                        Tidak ada akun pengguna yang cocok.
                      </td>
                    </tr>
                  )}

                  {!isLoading &&
                    !errorMessage &&
                    filteredUsers.map((user, index) => {
                      const isActive = user.deleted_at === null;
                      const isCurrentUser = user.uuid === currentUser?.uuid;

                      return (
                        <tr
                          key={user.uuid}
                          className="transition hover:bg-red-50/40"
                        >
                          <td className="px-5 py-4 text-slate-500">
                            {index + 1}
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-bold text-slate-800">
                              {user.nama_mahasiswa || "-"}
                              {isCurrentUser && (
                                <span className="ml-2 text-[10px] font-bold text-red-600">
                                  (Anda)
                                </span>
                              )}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              NIM: {user.nim || "-"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {user.email}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                                user.role_name === "super_admin"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {user.role_name === "super_admin"
                                ? "Super Admin"
                                : "Mahasiswa"}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-xs text-slate-500">
                            {formatDate(user.created_at)}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                                isActive
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {isActive ? "Aktif" : "Nonaktif"}
                            </span>

                            {!isActive && user.deleted_at && (
                              <p className="mt-1 text-[10px] text-slate-400">
                                {formatDate(user.deleted_at)}
                              </p>
                            )}
                          </td>

                          {/* ACTION */}
                          <td className="px-5 py-4">
                            {isActive ? (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEdit(user)}
                                  disabled={isCurrentUser}
                                  className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                                >
                                  ✎ Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenRoleModal(user)}
                                  disabled={isCurrentUser}
                                  title={
                                    isCurrentUser
                                      ? "Anda tidak dapat mengubah role akun sendiri"
                                      : "Ubah role akun"
                                  }
                                  className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  ⇄ Ubah Role
                                </button>
                              </div>
                            ) : (
                              <span className="block text-center text-xs text-slate-400">
                                Tidak tersedia
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER */}
            {!isLoading && !errorMessage && (
              <div className="border-t border-slate-100 px-5 py-4">
                <p className="text-xs text-slate-500">
                  Menampilkan{" "}
                  <strong className="text-slate-800">
                    {filteredUsers.length}
                  </strong>{" "}
                  dari{" "}
                  <strong className="text-slate-800">
                    {users.length}
                  </strong>{" "}
                  akun pengguna.
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

      {/* MODAL TAMBAH AKUN */}
      {isCreateModalOpen && (
        <UserFormModal
          mahasiswa={availableMahasiswa}
          isSubmitting={isSubmitting}
          onClose={handleCloseCreateModal}
          onSubmit={handleCreateUser}
        />
      )}

      {/* MODAL EDIT AKUN */}
      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          isSubmitting={isSubmitting}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateUser}
        />
      )}

      {/* MODAL UBAH ROLE */}
      {selectedRoleUser && (
        <UserRoleModal
          user={selectedRoleUser}
          isSubmitting={isSubmitting}
          onClose={handleCloseRoleModal}
          onSubmit={handleUpdateRole}
        />
      )}
    </div>
  );
}

export default UserList;
