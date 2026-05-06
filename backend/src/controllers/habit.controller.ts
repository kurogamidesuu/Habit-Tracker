import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../lib/prisma";

export const getHabits = async (req: AuthRequest, res: Response) => {
  const allHabits = await prisma.habit.findMany({
    where: {
      userId: req.user.id,
    }
  })

  if (allHabits && allHabits.length > 0) {
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
        currentStreak: 0,
        maxStreak: 0,
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

export const completeHabit = async (req: AuthRequest, res: Response) => {
  const { id, dateString } = req.body;

  try {
    const habit = await prisma.habit.findUnique({
      where: {
        id,
      }
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Could not find the habit",
      });
    }

    const existingLog = await prisma.habitLog.findFirst({
      where: {
        habitId: id,
        dateString
      }
    });

    if (existingLog) {
      return res.status(400).json({
        success: false,
        message: "Habit already completed today"
      });
    }

    const lastLog = await prisma.habitLog.findFirst({
      where: {
        habitId: id
      },
      orderBy: {
        dateString: 'desc'
      }
    });

    const todayObj = new Date(dateString);
    const yesterdayObj = new Date(todayObj);
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterdayString = yesterdayObj.toISOString().split('T')[0];

    let newStreak = 1;

    if (lastLog) {
      if (lastLog.dateString === yesterdayString) {
        newStreak = habit.currentStreak + 1;
      } else {
        newStreak = 1;
      }
    }

    const newLog = await prisma.habitLog.create({
      data: {
        dateString,
        habitId: id,
      }
    });

    const updatedHabit = await prisma.habit.update({
      where: {
        id,
      },
      data: {
        isComplete: true,
        currentStreak: newStreak
      }
    });

    return res.status(200).json({
      success: true,
      updatedHabit
    })
  } catch(e) {
    return res.status(500).json({
      success: false,
      message: "Failed to update the habit"
    })
  }
}