import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import HabitBox from '../components/HabitBox';

describe('HabitBox Component', () => {
  
  it('should accurately display the habit title and streak numbers', () => {
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

});