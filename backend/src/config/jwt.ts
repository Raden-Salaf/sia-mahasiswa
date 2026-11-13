import "dotenv/config";
import { SignJWT, jwtVerify } from "jose";

// Ambil secret key dari environment variable
const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
  throw new Error("JWT_SECRET belum diatur di file .env");
}

// Ubah secret menjadi Uint8Array
const secret = new TextEncoder().encode(secretKey);

// Masa berlaku token
const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

/**
 * Membuat JWT setelah pengguna berhasil login.
 */
export const generateToken = async (payload: {
  uuid: string;
  email: string;
  role: string;
}) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
};

/**
 * Memverifikasi JWT yang dikirim pengguna.
 */
export const verifyToken = async (token: string) => {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });

  return payload;
};
