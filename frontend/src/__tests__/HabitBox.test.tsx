import { beforeAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import HabitBox from '../components/HabitBox';
import { useHabitStore } from '../store/useHabitStore';

vi.mock('../store/useHabitStore', () => ({
  useHabitStore: vi.fn(),
}));

const mockedHabitStore = vi.mocked(useHabitStore);

describe('HabitBox Component', () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  it('should accurately display the habit title and streak numbers', () => {
    mockedHabitStore.mockReturnValue({ removeHabit: vi.fn() });

    render(
      <HabitBox
        id="test-id-132"
        title="Drink 2L water"
        currentStreak={5}
        maxStreak={12}
        isComplete={false}
      />
    );

    expect(screen.getByText('Drink 2L water')).toBeInTheDocument();
    expect(screen.getByText('Current Streak: 5')).toBeInTheDocument();
    expect(screen.getByText('Max Streak: 12')).toBeInTheDocument();
  });

  it('should call removeHabit with the correct ID when "Yes" is clicked', async () => {
    const mockRemoveHabit = vi.fn();

    mockedHabitStore.mockReturnValue({
      removeHabit: mockRemoveHabit
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
    const trashButton = buttons[0];
    fireEvent.click(trashButton);

    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);

    expect(mockRemoveHabit).toHaveBeenCalledTimes(1);
    expect(mockRemoveHabit).toHaveBeenCalledWith('test-id-67');
  });

});