export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        uuid: string;
        email: string;
        role: string;
        id_mhs: number | null;
      };
    }
  }
}
