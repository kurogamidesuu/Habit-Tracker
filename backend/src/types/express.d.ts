import { Request } from "express";

export interface JwtUser {
  id: number;
  email: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user: JwtUser;
    }
  }
}