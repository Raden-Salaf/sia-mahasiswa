import { useState } from "react";
import type { FormEvent } from "react";

import type { UserAccount, UpdateUserPayload } from "../../types/user";

interface UserEditModalProps {
  user: UserAccount;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: UpdateUserPayload) => Promise<void>;
}

function UserEditModal({
  user,
  isSubmitting,
  onClose,
  onSubmit,
}: UserEditModalProps) {
  // Email awal diambil dari akun yang sedang diedit.
  const [email, setEmail] = useState(user.email);

  // Password bersifat opsional.
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setValidationError("Email tidak boleh kosong.");
      return;
    }

    // Jika password diisi, validasi panjang dan konfirmasinya.
    if (password.length > 0) {
      if (password.length < 8 || password.length > 72) {
        setValidationError(
          "Password harus terdiri dari 8 sampai 72 karakter."
        );
        return;
      }

      if (password !== confirmPassword) {
        setValidationError("Konfirmasi password tidak sama.");
        return;
      }
    }

    // Susun payload hanya dari data yang ingin diperbarui.
    const payload: UpdateUserPayload = {
      email: normalizedEmail,
    };

    // Password hanya dikirim jika pengguna mengisinya.
    if (password.length > 0) {
      payload.password = password;
    }

    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Edit Akun Pengguna
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Perbarui informasi login akun mahasiswa.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Tutup modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            {/* IDENTITAS MAHASISWA */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Akun Mahasiswa
              </p>

              <p className="mt-2 font-bold text-slate-900">
                {user.nama_mahasiswa || "-"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                NIM: {user.nim || "-"}
              </p>
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="edit-user-email"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Email Login
                <span className="text-red-600"> *</span>
              </label>

              <input
                id="edit-user-email"
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

            {/* PASSWORD BARU */}
            <div>
              <label
                htmlFor="edit-user-password"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Password Baru
              </label>

              <input
                id="edit-user-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Kosongkan jika tidak ingin mengganti"
                minLength={8}
                maxLength={72}
                disabled={isSubmitting}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50 disabled:bg-slate-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Isi hanya jika ingin mengganti password. Panjang password
                harus 8 sampai 72 karakter.
              </p>
            </div>

            {/* KONFIRMASI PASSWORD */}
            <div>
              <label
                htmlFor="edit-user-confirm-password"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Konfirmasi Password Baru
              </label>

              <input
                id="edit-user-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Ulangi password baru"
                minLength={8}
                maxLength={72}
                required={password.length > 0}
                disabled={isSubmitting}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50 disabled:bg-slate-100"
              />
            </div>

            {/* INFORMASI */}
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs leading-relaxed text-amber-800">
                Password lama tidak ditampilkan demi keamanan. Jika kolom
                password baru dikosongkan, password akun tidak akan berubah.
              </p>
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

          {/* FOOTER */}
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
              disabled={isSubmitting}
              className="rounded-xl bg-red-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-red-900/10 transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserEditModal;
