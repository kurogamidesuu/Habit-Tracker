import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../lib/prisma";

export const getHabits = async (req: AuthRequest, res: Response) => {
  const allHabits = await prisma.habit.findMany({
    where: {
      userId: req.user?.id,
    }
  });

  if (allHabits && allHabits.length > 1) {
    return res.status(200).json({
      success: true,
      allHabits
    });
  }

  res.status(400).json({
    success: false,
    message: 'No habits yet'
  })
}

export const addHabit = async (req: AuthRequest, res: Response) => {
  const { title } = req.body;
  
  try {
    const newHabit = await prisma.habit.create({
      data: {
        title,
        streak: 0,
        isComplete: false,
        userId: req.user?.id,
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Created habit successfully'
    });
  } catch(e) {
    console.log('Error:', e);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
}

export const removeHabit = async (req: AuthRequest, res: Response) => {
  const { id } = req.body;

  try {
    await prisma.habit.delete({
      where: {
        id
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Deleted Habit successfully'
    });
  } catch(e) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete Habit'
    })
  }
}