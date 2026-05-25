import type { HabitWithAnalytics } from "../api/habits";

export interface AnalyticsResult {
  totalVolume: number;
  monthlyCompletionRate: number;
  chronotype: string;
  monthMatrix: { day: number; isCompleted: boolean; isFuture: boolean }[];
  weekdayFrictionMap: { day: string; rate: number; completed: number; potential: number }[];
}

const calcTotalVolume = (completions: HabitWithAnalytics['completions']): number => {
  return completions.length;
}

const calcMonthlyCompletionRate = (
  completions: HabitWithAnalytics['completions'],
  habitCreatedAt: string
): number => {
  const now = new Date();
  const currYear = now.getFullYear();
  const currMonth = now.getMonth();
  const todayDate = now.getDate();

  const habitCreated = new Date(habitCreatedAt);
  const createdYear = habitCreated.getFullYear();
  const createdMonth = habitCreated.getMonth();
  const createdDate = habitCreated.getDate();

  const startDay = (createdYear === currYear && createdMonth === currMonth) ? createdDate : 1;

  const denominator = todayDate - startDay + 1;
  if (denominator <= 0) return 0;

  const completionsThisMonth = completions.filter(c => {
    const d = new Date(c.dateString);
    return d.getFullYear() === currYear && d.getMonth() === currMonth;
  }).length;

  return Math.round((completionsThisMonth / denominator) * 100);
}

const calcChronotype = (completions: HabitWithAnalytics['completions']): string => {
  if (completions.length === 0) return 'No data yet';

  let morning = 0;   // 5am - 11:59am
  let afternoon = 0; // 12pm - 4:59pm
  let night = 0;     // 5pm - 4:59am

  completions.forEach(c => {
    const hour = new Date(c.createdAt).getHours();
    if (hour >= 5 && hour < 12) morning++;
    else if (hour >= 12 && hour < 17) afternoon++;
    else night++;
  });

  const max = Math.max(morning, afternoon, night);
  if (max === morning) return '🌤️ Morning Person';
  if (max === afternoon) return '☀️ Afternoon Grinder';
  return '🌙 Night Owl';
}

const calcMonthMatrix = (
  completions: HabitWithAnalytics['completions']
): { day: number; isCompleted: boolean; isFuture: boolean }[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const today = now.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const completedDates = new Set(
    completions
      .filter(c => {
        const d = new Date(c.dateString);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      })
      .map(c => new Date(c.dateString).getDate())
  );

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return {
      day,
      isCompleted: completedDates.has(day),
      isFuture: day > today,
    };
  });
}

const calcWeekdayFrictionMap = (
  completions: HabitWithAnalytics['completions'],
  habitCreatedAt: string
): { day: string; rate: number; completed: number; potential: number }[] => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  const created = new Date(habitCreatedAt);

  const potential = new Array(7).fill(0);
  const cursor = new Date(created);
  cursor.setHours(0, 0, 0, 0);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  while (cursor <= today) {
    potential[cursor.getDay()]++;
    cursor.setDate(cursor.getDate() + 1);
  }

  const completed = new Array(7).fill(0);
  completions.forEach(c => {
    const weekday = new Date(c.dateString).getDay();
    completed[weekday]++;
  });

  return days.map((day, i) => ({
    day,
    completed: completed[i],
    potential: potential[i],
    rate: potential[i] > 0 ? Math.round((completed[i] / potential[i]) * 100) : 0,
  }));
}

export const calculateAnalytics = (habit: HabitWithAnalytics): AnalyticsResult => {
  return {
    totalVolume: calcTotalVolume(habit.completions),
    monthlyCompletionRate: calcMonthlyCompletionRate(habit.completions, habit.createdAt),
    chronotype: calcChronotype(habit.completions),
    monthMatrix: calcMonthMatrix(habit.completions),
    weekdayFrictionMap: calcWeekdayFrictionMap(habit.completions, habit.createdAt),
  };
}