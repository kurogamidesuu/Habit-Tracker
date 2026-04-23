import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import 'dotenv/config.js';
import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

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
    
    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Created account successfully!'
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
    const token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET!);
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