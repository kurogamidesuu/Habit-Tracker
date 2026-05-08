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
  const { id, username, email } = req.user;

  res.status(200).json({
    success: true,
    user: {
      id,
      username,
      email
    }
  });
}