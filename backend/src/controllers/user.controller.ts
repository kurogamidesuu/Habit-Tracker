import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import 'dotenv/config.js';
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Account with that email already exists'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      }
    });

    const payload = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username
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

    return res.status(200).json({
      success: true,
      message: 'Created account successfully!',
      token: accessToken
    })

  } catch(e) {
    console.error("Error:", e);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Account not found'
    });
  }

  const match = await bcrypt.compare(password, user.password);

  if (match) {
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

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token: accessToken,
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
  }
}

export const getUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.user;

  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) return res.status(404).json({
    success: false,
    message: 'User not found',
  });

  res.status(200).json({
    success: true,
    user: {
      id,
      username: user.username,
      email: user.email,
      notificationsEnabled: user.notificationsEnabled,
      streakWarningEnabled: user.streakWarningEnabled,
      dailyReminderTime: user.dailyReminderTime,
    }
  });
}

export const updatePreferences = async (req: AuthRequest, res: Response) => {
  const { id } = req.user;
  const { notificationsEnabled, streakWarningEnabled, dailyReminderTime } = req.body;

  try {
    await prisma.user.update({
      where: { id },
      data: {
        ...(notificationsEnabled !== undefined && { notificationsEnabled }),
        ...(streakWarningEnabled !== undefined && { streakWarningEnabled }),
        ...(dailyReminderTime !== undefined && { dailyReminderTime }),
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
    })
  } catch (e) {
    console.error('Failed to update preferences:', e);
    return res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
    })
  }
}

export const changeUsername = async (req: AuthRequest, res: Response) => {
  const { id } = req.user;
  const { newUsername } = req.body;

  if (!newUsername || newUsername.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Username cannot be empty',
    })
  }

  try {
    await prisma.user.update({
      where: { id },
      data: {
        username: newUsername,
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Username updated successfully',
    });
  } catch (e) {
    console.error('Failed to change username', e);
    return res.status(500).json({
      success: false,
      message: 'Failed to change username',
    });
  }
}

export const changePassword = async (req: AuthRequest, res: Response) => {
  const { id } = req.user;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const match = await bcrypt.compare(currentPassword, user.password);

    if (match) {
      const newHash = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id },
        data: {
          password: newHash,
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Password updated successfully',
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid Password',
      });
    }
  } catch (e) {
    console.error('Failed to change password', e);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password',
    });
  }
}

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  const { id } = req.user;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) return res.status(404).json({
    success: false,
    message: 'User not found',
  });

  try {
    await prisma.user.delete({
      where: { id },
    });

    res.clearCookie('habit-refresh-token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (e) {
    console.error('Failed to delete account', e);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete account',
    });
  }
}