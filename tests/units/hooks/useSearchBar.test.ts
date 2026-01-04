import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useSearchBar from '@/hooks/useSearchBar';

describe('useSearchBar Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
  });

  it('initializes with the provided value', () => {
    const { result } = renderHook(() => useSearchBar({ initialValue: 'test' }));
    expect(result.current.search).toBe('test');
  });

  it('updates state immediately on handleChange', () => {
    const { result } = renderHook(() => useSearchBar());
    
    act(() => {
      result.current.handleChange({ target: { value: 'new query' } } as any);
    });

    expect(result.current.search).toBe('new query');
  });

  it('debounces the onSearchChange callback', () => {
    const onSearchChange = vi.fn();
    const { result } = renderHook(() => 
      useSearchBar({ debounceMs: 500, onSearchChange })
    );

    act(() => {
      result.current.setSearch('abc');
    });

    expect(onSearchChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onSearchChange).toHaveBeenCalledWith('abc');
  });

  it('emits a globalSearch event when enabled', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    const { result } = renderHook(() => 
      useSearchBar({ debounceMs: 100, emitGlobal: true })
    );

    act(() => {
      result.current.setSearch('global query');
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(dispatchSpy).toHaveBeenCalled();
    const lastCall = dispatchSpy.mock.calls.find(call => call[0].type === 'globalSearch');
    const event = lastCall?.[0] as CustomEvent;
    
    expect(event.detail).toBe('global query');
  });

  it('does not emit globalSearch if emitGlobal is false', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    const { result } = renderHook(() => 
      useSearchBar({ emitGlobal: false, debounceMs: 100 })
    );

    act(() => {
      result.current.setSearch('private query');
      vi.advanceTimersByTime(100);
    });

    const globalEventCalled = dispatchSpy.mock.calls.some(call => call[0].type === 'globalSearch');
    expect(globalEventCalled).toBe(false);
  });

  it('updates internal search when initialValue prop changes', () => {
    const { result, rerender } = renderHook(
      ({ val }) => useSearchBar({ initialValue: val }),
      { initialProps: { val: 'first' } }
    );

    expect(result.current.search).toBe('first');

    rerender({ val: 'second' });
    expect(result.current.search).toBe('second');
  });
});