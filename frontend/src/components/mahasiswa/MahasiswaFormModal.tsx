import { useState, type FormEvent } from "react";

import type {
  Mahasiswa,
  MahasiswaInput,
} from "../../types/mahasiswa";

// Properti yang diterima oleh komponen form.
interface MahasiswaFormModalProps {
  initialData: Mahasiswa | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: MahasiswaInput) => Promise<void>;
}

// Nilai awal form ketika menambahkan mahasiswa baru.
const emptyForm: MahasiswaInput = {
  nim: "",
  nama_mahasiswa: "",
  jenis_kelamin: "L",
  tempat_lahir: "",
  tanggal_lahir: "",
  kelas: "",
  alamat: "",
  nama_ibu_kandung: "",
  no_hp_wali: "",
  keterangan: "",
};

function MahasiswaFormModal({
  initialData,
  isSubmitting,
  onClose,
  onSubmit,
}: MahasiswaFormModalProps) {
  // Jika initialData tersedia, berarti form sedang digunakan untuk edit.
  const [form, setForm] = useState<MahasiswaInput>(() => {
    if (!initialData) return { ...emptyForm };

    return {
      nim: initialData.nim,
      nama_mahasiswa: initialData.nama_mahasiswa,
      jenis_kelamin: initialData.jenis_kelamin,
      tempat_lahir: initialData.tempat_lahir,
      tanggal_lahir: initialData.tanggal_lahir.slice(0, 10),
      kelas: initialData.kelas,
      alamat: initialData.alamat,
      nama_ibu_kandung: initialData.nama_ibu_kandung,
      no_hp_wali: initialData.no_hp_wali,
      keterangan: initialData.keterangan ?? "",
    };
  });

  // Memperbarui nilai field berdasarkan nama input.
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Mengirim data ke komponen induk.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: MahasiswaInput = {
      ...form,
      nim: form.nim.trim(),
      nama_mahasiswa: form.nama_mahasiswa.trim(),
      tempat_lahir: form.tempat_lahir.trim(),
      kelas: form.kelas.trim(),
      alamat: form.alamat.trim(),
      nama_ibu_kandung: form.nama_ibu_kandung.trim(),
      no_hp_wali: form.no_hp_wali.trim(),
      keterangan: form.keterangan?.trim() || null,
    };

    await onSubmit(payload);
  };

  const isEdit = Boolean(initialData);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <section className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-7">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              {isEdit ? "Edit Data Mahasiswa" : "Tambah Mahasiswa"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {isEdit
                ? "Perbarui informasi mahasiswa di bawah ini."
                : "Lengkapi formulir untuk menambahkan mahasiswa baru."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Tutup form"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* FORM CONTENT */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto p-5 sm:p-7"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* NIM */}
            <div>
              <label
                htmlFor="nim"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                NIM <span className="text-red-600">*</span>
              </label>

              <input
                id="nim"
                name="nim"
                value={form.nim}
                onChange={handleChange}
                maxLength={20}
                required
                placeholder="Contoh: 240001"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50"
              />
            </div>

            {/* NAMA */}
            <div>
              <label
                htmlFor="nama_mahasiswa"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Nama Mahasiswa <span className="text-red-600">*</span>
              </label>

              <input
                id="nama_mahasiswa"
                name="nama_mahasiswa"
                value={form.nama_mahasiswa}
                onChange={handleChange}
                maxLength={150}
                required
                placeholder="Masukkan nama lengkap"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50"
              />
            </div>

            {/* JENIS KELAMIN */}
            <div>
              <label
                htmlFor="jenis_kelamin"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Jenis Kelamin <span className="text-red-600">*</span>
              </label>

              <select
                id="jenis_kelamin"
                name="jenis_kelamin"
                value={form.jenis_kelamin}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            {/* TEMPAT LAHIR */}
            <div>
              <label
                htmlFor="tempat_lahir"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Tempat Lahir <span className="text-red-600">*</span>
              </label>

              <input
                id="tempat_lahir"
                name="tempat_lahir"
                value={form.tempat_lahir}
                onChange={handleChange}
                maxLength={100}
                required
                placeholder="Contoh: Jakarta"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50"
              />
            </div>

            {/* TANGGAL LAHIR */}
            <div>
              <label
                htmlFor="tanggal_lahir"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Tanggal Lahir <span className="text-red-600">*</span>
              </label>

              <input
                id="tanggal_lahir"
                name="tanggal_lahir"
                type="date"
                value={form.tanggal_lahir}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50"
              />
            </div>

            {/* KELAS */}
            <div>
              <label
                htmlFor="kelas"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Kelas <span className="text-red-600">*</span>
              </label>

              <input
                id="kelas"
                name="kelas"
                value={form.kelas}
                onChange={handleChange}
                maxLength={50}
                required
                placeholder="Contoh: TI-2024-A"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50"
              />
            </div>

            {/* NAMA IBU */}
            <div>
              <label
                htmlFor="nama_ibu_kandung"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Nama Ibu Kandung <span className="text-red-600">*</span>
              </label>

              <input
                id="nama_ibu_kandung"
                name="nama_ibu_kandung"
                value={form.nama_ibu_kandung}
                onChange={handleChange}
                maxLength={150}
                required
                placeholder="Nama ibu kandung"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50"
              />
            </div>

            {/* NOMOR HP WALI */}
            <div>
              <label
                htmlFor="no_hp_wali"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Nomor HP Wali <span className="text-red-600">*</span>
              </label>

              <input
                id="no_hp_wali"
                name="no_hp_wali"
                type="tel"
                value={form.no_hp_wali}
                onChange={handleChange}
                maxLength={20}
                minLength={8}
                required
                placeholder="Contoh: 081234567890"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50"
              />
            </div>

            {/* ALAMAT */}
            <div className="sm:col-span-2">
              <label
                htmlFor="alamat"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Alamat <span className="text-red-600">*</span>
              </label>

              <textarea
                id="alamat"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                rows={3}
                required
                placeholder="Masukkan alamat lengkap mahasiswa"
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50"
              />
            </div>

            {/* KETERANGAN */}
            <div className="sm:col-span-2">
              <label
                htmlFor="keterangan"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Keterangan
                <span className="ml-2 text-xs font-normal text-slate-400">
                  (Opsional)
                </span>
              </label>

              <textarea
                id="keterangan"
                name="keterangan"
                value={form.keterangan ?? ""}
                onChange={handleChange}
                rows={2}
                placeholder="Keterangan tambahan jika ada"
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50"
              />
            </div>
          </div>

          {/* FOOTER FORM */}
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-red-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/10 transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Simpan Mahasiswa"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default MahasiswaFormModal;
