import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTodos } from '../useTodos';

global.fetch = vi.fn();

describe('useTodos Hook', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('fetches todos on mount', async () => {
    const mockTodos = [{ id: 1, name: 'Test Todo', completed: false }];
    fetch.mockResolvedValueOnce({
      json: async () => mockTodos,
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.tasks).toEqual(mockTodos);
    });
  });
});