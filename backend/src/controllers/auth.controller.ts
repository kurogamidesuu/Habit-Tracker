import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { prisma } from "../lib/prisma";

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies['habit-refresh-token'];

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'No refresh token found',
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { id: number; email: string; username: string };

    const user = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    return res.status(200).json({
      success: true,
      token: accessToken,
    });
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('habit-refresh-token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
}

export const googleCallback = async (req: Request, res: Response) => {
  const user = req.user as { id: number; email: string; username: string };

  const payload = {
    id: user.id,
    email: user.email,
    username: user.username
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: 60 * 60 * 24 * 7 }
  );

  res.cookie('habit-refresh-token', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}`);
}