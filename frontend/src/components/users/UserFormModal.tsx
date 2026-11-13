import { useState } from "react";
import type { FormEvent } from "react";

import type { Mahasiswa } from "../../types/mahasiswa";
import type { CreateUserPayload } from "../../types/user";

// Props yang diterima oleh komponen modal.
interface UserFormModalProps {
  mahasiswa: Mahasiswa[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateUserPayload) => Promise<void>;
}

function UserFormModal({
  mahasiswa,
  isSubmitting,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  // Menyimpan ID mahasiswa yang dipilih.
  const [selectedMahasiswaId, setSelectedMahasiswaId] = useState("");

  // Menyimpan email dan password akun.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Pesan kesalahan validasi form.
  const [validationError, setValidationError] = useState("");

  // Menangani pengiriman form.
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setValidationError("");

    // Pastikan mahasiswa sudah dipilih.
    if (!selectedMahasiswaId) {
      setValidationError("Silakan pilih mahasiswa terlebih dahulu.");
      return;
    }

    // Pastikan password dan konfirmasi sama.
    if (password !== confirmPassword) {
      setValidationError("Konfirmasi password tidak sama.");
      return;
    }

    // Validasi tambahan sebelum dikirim ke backend.
    if (password.length < 8 || password.length > 72) {
      setValidationError(
        "Password harus terdiri dari 8 sampai 72 karakter."
      );
      return;
    }

    // Susun payload sesuai kontrak API backend.
    const payload: CreateUserPayload = {
      id_mhs: Number(selectedMahasiswaId),
      email: email.trim().toLowerCase(),
      password,
    };

    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Tambah Akun Pengguna
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Buat akun login untuk mahasiswa.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Tutup modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* MODAL BODY */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            {/* INFORMASI ROLE */}
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                Role Akun
              </p>

              <p className="mt-1 text-sm font-bold text-blue-900">
                Mahasiswa
              </p>

              <p className="mt-1 text-xs leading-relaxed text-blue-700">
                Role diberikan otomatis oleh backend ketika akun dibuat.
              </p>
            </div>

            {/* PILIH MAHASISWA */}
            <div>
              <label
                htmlFor="user-mahasiswa"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Pilih Mahasiswa
                <span className="text-red-600"> *</span>
              </label>

              <select
                id="user-mahasiswa"
                value={selectedMahasiswaId}
                onChange={(event) =>
                  setSelectedMahasiswaId(event.target.value)
                }
                required
                disabled={isSubmitting || mahasiswa.length === 0}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50 disabled:bg-slate-100"
              >
                <option value="">
                  -- Pilih mahasiswa --
                </option>

                {mahasiswa.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nim} - {item.nama_mahasiswa} ({item.kelas})
                  </option>
                ))}
              </select>

              {mahasiswa.length === 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  Tidak ada mahasiswa yang tersedia untuk dibuatkan akun.
                </p>
              )}

              <p className="mt-2 text-xs text-slate-400">
                Hanya mahasiswa yang belum memiliki akun yang ditampilkan.
              </p>
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="user-email"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Email Login
                <span className="text-red-600"> *</span>
              </label>

              <input
                id="user-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="contoh@email.com"
                maxLength={150}
                required
                disabled={isSubmitting}
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50 disabled:bg-slate-100"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="user-password"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Password
                <span className="text-red-600"> *</span>
              </label>

              <input
                id="user-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimal 8 karakter"
                minLength={8}
                maxLength={72}
                required
                disabled={isSubmitting}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50 disabled:bg-slate-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Password harus terdiri dari 8 sampai 72 karakter.
              </p>
            </div>

            {/* KONFIRMASI PASSWORD */}
            <div>
              <label
                htmlFor="user-confirm-password"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Konfirmasi Password
                <span className="text-red-600"> *</span>
              </label>

              <input
                id="user-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Masukkan ulang password"
                minLength={8}
                maxLength={72}
                required
                disabled={isSubmitting}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50 disabled:bg-slate-100"
              />
            </div>

            {/* VALIDATION ERROR */}
            {validationError && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {validationError}
              </div>
            )}
          </div>

          {/* MODAL FOOTER */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting || mahasiswa.length === 0}
              className="rounded-xl bg-red-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-red-900/10 transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Buat Akun"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserFormModal;