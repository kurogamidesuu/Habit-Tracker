import { beforeEach, describe, expect, it } from "vitest";
import { useHabitStore } from "../store/useHabitStore";

describe('Habit Store', () => {
  beforeEach(() => {
    useHabitStore.setState({
      habits: [],
      isLoading: false,
    });
  });

  it('should reset all habits to incomplete at midnight', () => {
    useHabitStore.setState({
      habits: [
        { id: '1', title: 'Water', currentStreak: 5, maxStreak: 5, isComplete: true },
        { id: '2', title: 'Read', currentStreak: 2, maxStreak: 3, isComplete: true }
      ]
    });

    useHabitStore.getState().resetHabitsAtMidnight();

    const updatedHabits = useHabitStore.getState().habits;
    expect(updatedHabits[0].isComplete).toBe(false);
    expect(updatedHabits[1].isComplete).toBe(false);

    expect(updatedHabits[0].currentStreak).toBe(5);
  });
});