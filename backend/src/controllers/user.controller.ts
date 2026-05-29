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

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '7d'
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Created account successfully!',
      token
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
    const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: '7d'
    }
  );

  return res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    token: token,
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