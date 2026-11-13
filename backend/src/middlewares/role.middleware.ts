import type { Request, Response, NextFunction } from "express";

/**
 * Membatasi akses endpoint berdasarkan role pengguna.
 *
 * Contoh:
 * authorizeRoles("super_admin")
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Pastikan pengguna sudah melewati authentication
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Silakan login terlebih dahulu.",
      });
      return;
    }

    // Periksa apakah role pengguna diizinkan
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Anda tidak memiliki izin untuk mengakses resource ini.",
      });
      return;
    }

    next();
  };
};
