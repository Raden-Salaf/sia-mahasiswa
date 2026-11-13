import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import MahasiswaList from "./pages/mahasiswa/MahasiswaList";
import UserList from "./pages/users/UserList";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Memeriksa status autentikasi sebelum menampilkan login.
function LoginRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm font-medium text-slate-600">
          Memeriksa sesi pengguna...
        </p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
}

// Seluruh konfigurasi route aplikasi.
function AppRoutes() {
  return (
    <Routes>
      {/* Halaman utama */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Halaman login */}
      <Route
        path="/login"
        element={<LoginRoute />}
      />

      {/* Semua halaman yang membutuhkan login */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Route>

      {/* Halaman khusus Super Admin */}
      <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
        <Route
          path="/mahasiswa"
          element={<MahasiswaList />}
        />

        <Route
          path="/users"
          element={<UserList />}
        />
      </Route>

      {/* Halaman akses ditolak */}
      <Route
        path="/unauthorized"
        element={
          <div className="flex min-h-screen flex-col items-center justify-center gap-3">
            <h1 className="text-3xl font-bold text-red-700">
              403 - Akses Ditolak
            </h1>

            <p className="text-slate-600">
              Kamu tidak memiliki izin untuk mengakses halaman ini.
            </p>
          </div>
        }
      />

      {/* Halaman tidak ditemukan */}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center">
            <h1 className="text-2xl font-bold">
              404 - Halaman Tidak Ditemukan
            </h1>
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
