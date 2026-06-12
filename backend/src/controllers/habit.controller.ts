import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getHabits = async (req: Request, res: Response) => {
  const today = (req.query.today as string) || new Date().toLocaleDateString('en-CA');

  const todayObj = new Date(today);
  const yesterdayObj = new Date(todayObj);
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterday = yesterdayObj.toISOString().split('T')[0] as string;

  const habits = await prisma.habit.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      completions: {
        where: {
          dateString: {
            in: [today, yesterday]
          }
        }
      }
    }
  });

  const allHabits = await Promise.all(
    habits.map(async (habit) => {
      const completedToday = habit.completions.some(c => c.dateString === today);
      const completedYesterday = habit.completions.some(c => c.dateString === yesterday);
      const streakAlive = completedToday || completedYesterday;

      const updates: { currentStreak?: number; isComplete?: boolean } = {};

      if (!streakAlive && habit.currentStreak > 0) {
        updates.currentStreak = 0;
      }

      if (!completedToday && habit.isComplete) {
        updates.isComplete = false;
      }

      if (Object.keys(updates).length > 0) {
        const updated = await prisma.habit.update({
          where: { id: habit.id },
          data: updates
        });

        const { completions, ...rest } = { ...habit, ...updated };
        return rest;
      }

      const { completions, ...rest } = habit;
      return rest;
    })
  );

  if (allHabits && allHabits.length > 0) {
    return res.status(200).json({
      success: true,
      allHabits
    });
  }

  res.status(200).json({
    success: true,
    allHabits: []
  })
}

export const addHabit = async (req: Request, res: Response) => {
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

export const removeHabit = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const { count } = await prisma.habit.deleteMany({
      where: {
        id: Number(id),
        userId: req.user.id,
      }
    });

    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

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

export const completeHabit = async (req: Request, res: Response) => {
  const { id, dateString } = req.body;

  try {
    const habit = await prisma.habit.findUnique({
      where: {
        id: Number(id),
      }
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Could not find the habit",
      });
    }

    if (habit.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this habit",
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
        id: Number(id),
        userId: req.user.id,
      },
      data: {
        isComplete: true,
        currentStreak: newStreak,
        maxStreak: Math.max(habit.maxStreak, newStreak)
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

export const getHabitAnalytics = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const habitId = parseInt(id as string, 10);
    if (isNaN(habitId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid habit ID format',
      });
    }

    const habit = await prisma.habit.findUnique({
      where: {
        id: habitId,
      },
      include: {
        completions: {
          orderBy: {
            dateString: 'asc',
          },
        },
      },
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found',
      });
    }

    if (habit.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this habit",
      });
    }

    return res.status(200).json({
      success: true,
      habit,
    });
  } catch (e) {
    console.log("Analytics Error:", e);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch habit analytics',
    });
  }
}