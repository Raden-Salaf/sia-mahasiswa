import { useState } from "react";
import type { FormEvent } from "react";

import type {
  UserAccount,
  UpdateUserRolePayload,
} from "../../types/user";

interface UserRoleModalProps {
  user: UserAccount;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: UpdateUserRolePayload) => Promise<void>;
}

function UserRoleModal({
  user,
  isSubmitting,
  onClose,
  onSubmit,
}: UserRoleModalProps) {
  const [roleId, setRoleId] = useState(String(user.role_id));
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError("");

    const selectedRoleId = Number(roleId);

    if (![1, 2].includes(selectedRoleId)) {
      setValidationError("Role yang dipilih tidak valid.");
      return;
    }

    if (selectedRoleId === user.role_id) {
      setValidationError("Role yang dipilih sama dengan role saat ini.");
      return;
    }

    const payload: UpdateUserRolePayload = {
      role_id: selectedRoleId,
    };

    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Ubah Role Pengguna
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Atur hak akses akun pengguna.
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

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            {/* IDENTITAS AKUN */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Akun Pengguna
              </p>

              <p className="mt-2 font-bold text-slate-900">
                {user.nama_mahasiswa || "-"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                NIM: {user.nim || "-"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Email: {user.email}
              </p>
            </div>

            {/* ROLE SAAT INI */}
            <div>
              <p className="mb-2 text-sm font-bold text-slate-700">
                Role Saat Ini
              </p>

              <span
                className={`inline-flex rounded-lg px-3 py-2 text-xs font-bold ${
                  user.role_name === "super_admin"
                    ? "bg-red-50 text-red-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {user.role_name === "super_admin"
                  ? "Super Admin"
                  : "Mahasiswa"}
              </span>
            </div>

            {/* ROLE BARU */}
            <div>
              <label
                htmlFor="user-new-role"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Pilih Role Baru
                <span className="text-red-600"> *</span>
              </label>

              <select
                id="user-new-role"
                value={roleId}
                onChange={(event) => setRoleId(event.target.value)}
                disabled={isSubmitting}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50 disabled:bg-slate-100"
              >
                <option value="2">Mahasiswa</option>
                <option value="1">Super Admin</option>
              </select>

              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Super Admin memiliki hak akses pengelolaan sistem.
                Mahasiswa hanya dapat mengakses fitur sesuai hak aksesnya.
              </p>
            </div>

            {/* PERINGATAN */}
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs leading-relaxed text-amber-800">
                Perubahan role akan langsung memengaruhi hak akses akun
                setelah perubahan berhasil disimpan. Backend tetap
                melindungi akun Super Admin terakhir.
              </p>
            </div>

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
              disabled={isSubmitting || Number(roleId) === user.role_id}
              className="rounded-xl bg-red-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-red-900/10 transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserRoleModal;
