import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTodos } from '../useTodos';
import * as api from '../../services/api';

vi.mock('../../services/api');

describe('useTodos Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches todos on mount', async () => {
    const mockTodos = [{ id: 1, name: 'Test Todo', completed: false }];
    api.getTodos.mockResolvedValueOnce(mockTodos);

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.tasks).toEqual(mockTodos);
    });
  });
});