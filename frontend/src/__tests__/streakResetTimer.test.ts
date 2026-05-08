import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useResetStreak } from "../hooks/streakResetTimer";

describe('Streak Reset at midnight Test', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should trigger useResetStreak callback when the day rolls over to midnight', () => {
    const mockCallback = vi.fn();
    const now = new Date();
    const lateNight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23, 59, 0
    );
    vi.setSystemTime(lateNight);

    renderHook(() => useResetStreak(mockCallback));

    expect(mockCallback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2 * 60 * 1000);
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});