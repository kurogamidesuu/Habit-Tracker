import { beforeAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import HabitBox from '../components/HabitBox';
import { useHabits } from '../hooks/useHabits';
import type { UseMutationResult } from '@tanstack/react-query';
import type { Habit } from '../api/habits';

vi.mock('../hooks/useHabits', () => ({
  useHabits: vi.fn(),
}));

const mockedUseHabits = vi.mocked(useHabits);

const mockMutation = <TData, TVariables, TContext = unknown>(mutateAsync = vi.fn()) => ({
  mutateAsync,
  mutate: vi.fn(),
  isPending: false,
  isError: false,
  isSuccess: false,
  isIdle: true,
  error: null,
  data: undefined,
  reset: vi.fn(),
  status: 'idle' as const,
  variables: undefined,
  context: undefined,
  failureCount: 0,
  failureReason: null,
  submittedAt: 0,
}) as unknown as UseMutationResult<TData, Error, TVariables, TContext>

type HabitContext = { previousHabits: Habit[] | undefined };

describe('HabitBox Component', () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  it('should accurately display the habit title and streak numbers', () => {
    mockedUseHabits.mockReturnValue({
      removeHabit: mockMutation<string, string, HabitContext>(),
      addNewHabit: mockMutation<string, string>(),
      markHabitComplete: mockMutation<void, { id: string, dateString: string }, HabitContext>(),
      habits: [],
      isLoading: false,
      error: null,
    });

    render(
      <HabitBox
        id="test-id-132"
        title="Drink 2L water"
        currentStreak={5}
        maxStreak={12}
        isComplete={false}
      />
    );

    expect(screen.getByText(/Drink 2L water/i)).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
    expect(screen.getByText(/12/)).toBeInTheDocument();
  });

  it('should call removeHabit with the correct ID when confirmation is accepted', async () => {
    const mockMutateAsync = vi.fn();

    mockedUseHabits.mockReturnValue({
      removeHabit: mockMutation<string, string, HabitContext>(mockMutateAsync),
      addNewHabit: mockMutation<string, string>(),
      markHabitComplete: mockMutation<void, { id: string, dateString: string }, HabitContext>(),
      habits: [],
      isLoading: false,
      error: null,
    });

    render(
      <HabitBox
        id='test-id-67'
        title='Go on a walk'
        currentStreak={0}
        maxStreak={69}
        isComplete={false}
      />
    );

    const buttons = screen.getAllByRole('button');
    const deleteTrigger = buttons[1]; 
    
    fireEvent.click(deleteTrigger);

    const yesButton = await screen.findByText(/yes/i);
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledTimes(1);
      expect(mockMutateAsync).toHaveBeenCalledWith('test-id-67');
    });
  });
});