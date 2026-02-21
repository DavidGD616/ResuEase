import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately without waiting for the delay', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('does not update the value before the delay has elapsed', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 300 } }
    );

    rerender({ value: 'world', delay: 300 });

    // Advance time but not enough to trigger the update
    act(() => { vi.advanceTimersByTime(299); });

    expect(result.current).toBe('hello');
  });

  it('updates the value exactly when the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 300 } }
    );

    rerender({ value: 'world', delay: 300 });
    act(() => { vi.advanceTimersByTime(300); });

    expect(result.current).toBe('world');
  });

  it('resets the timer each time the value changes — only the final value is applied', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 300 } }
    );

    // Change to 'b', wait 200ms (not enough)
    rerender({ value: 'b', delay: 300 });
    act(() => { vi.advanceTimersByTime(200); });

    // Change to 'c' before 'b' can settle — timer resets
    rerender({ value: 'c', delay: 300 });
    act(() => { vi.advanceTimersByTime(200); });

    // Only 200ms since the last change — should still hold initial value
    expect(result.current).toBe('a');

    // Advance to 300ms after the last change
    act(() => { vi.advanceTimersByTime(100); });

    // Now settled on 'c' — 'b' was never applied
    expect(result.current).toBe('c');
  });

  it('works with non-string generic types', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: number }) => useDebounce(value, 500),
      { initialProps: { value: 1 } }
    );

    rerender({ value: 42 });
    act(() => { vi.advanceTimersByTime(500); });

    expect(result.current).toBe(42);
  });
});
