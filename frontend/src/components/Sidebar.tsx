import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { alertService } from "../services/alert.service";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// Tipe data untuk setiap menu sidebar.
interface NavigationItem {
  label: string;
  icon: string;
  path?: string;
  disabled?: boolean;
}

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Menu Super Admin.
  const adminNavigation: NavigationItem[] = [
    {
      label: "Dashboard",
      icon: "▦",
      path: "/dashboard",
    },
    {
      label: "Data Mahasiswa",
      icon: "♙",
      path: "/mahasiswa",
    },
    {
      label: "Manajemen Pengguna",
      icon: "♧",
      path: "/users",
    },
    {
      label: "Data Dosen",
      icon: "♙",
      disabled: true,
    },
    {
      label: "Mata Kuliah",
      icon: "▤",
      disabled: true,
    },
    {
      label: "Jadwal Kuliah",
      icon: "▦",
      disabled: true,
    },
  ];

  // Menu Mahasiswa.
  const studentNavigation: NavigationItem[] = [
    {
      label: "Dashboard",
      icon: "▦",
      path: "/dashboard",
    },
    {
      label: "Profil Saya",
      icon: "♙",
      disabled: true,
    },
    {
      label: "Jadwal Kuliah",
      icon: "▤",
      disabled: true,
    },
  ];

  // Pilih menu berdasarkan role pengguna.
  const navigation =
    user?.role === "super_admin"
      ? adminNavigation
      : studentNavigation;

  const roleLabel =
    user?.role === "super_admin"
      ? "Super Admin"
      : "Mahasiswa";

  // Proses logout.
  const handleLogout = async () => {
    const result = await alertService.confirm(
      "Keluar dari sistem?",
      "Apakah kamu yakin ingin mengakhiri sesi sekarang?"
    );

    if (!result.isConfirmed) return;

    logout();
    setSidebarOpen(false);

    await alertService.success(
      "Logout berhasil",
      "Kamu telah keluar dari sistem."
    );

    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Overlay untuk menutup sidebar di perangkat mobile. */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* BRAND */}
        <div className="flex h-20 shrink-0 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-800 to-red-600 text-xl font-extrabold text-white shadow-lg shadow-red-900/20">
            S
          </div>

          <div>
            <h1 className="text-base font-extrabold tracking-wide text-slate-900">
              SIA MAHASISWA
            </h1>

            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Administration System
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup sidebar"
            className="ml-auto rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-700 lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Menu {roleLabel}
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              // Menu yang sudah memiliki route.
              if (item.path && !item.disabled) {
                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                        isActive
                          ? "bg-red-50 text-red-700"
                          : "text-slate-500 hover:bg-slate-50 hover:text-red-700"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg text-lg">
                          {item.icon}
                        </span>

                        <span>{item.label}</span>

                        {isActive && (
                          <span className="ml-auto h-2 w-2 rounded-full bg-red-600" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              }

              // Menu yang halamannya belum dibuat.
              return (
                <button
                  key={item.label}
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-300"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg text-lg">
                    {item.icon}
                  </span>

                  <span className="flex-1">{item.label}</span>

                  <span className="text-[9px] font-bold uppercase tracking-wide">
                    Soon
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="shrink-0 border-t border-slate-100 p-5">
          <div className="rounded-xl bg-red-50 p-4">
            <p className="text-xs font-bold text-red-800">
              SIA Mahasiswa
            </p>

            <p className="mt-1 text-[11px] leading-5 text-red-600/80">
              Sistem administrasi akademik terintegrasi.
            </p>
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 flex w-full items-center gap-3 rounded-xl border border-red-100 px-4 py-3 text-sm font-bold text-red-700 transition duration-200 hover:border-red-200 hover:bg-red-50"
          >
            <span className="text-lg">⇥</span>
            Keluar dari Sistem
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
