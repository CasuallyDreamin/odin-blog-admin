import { describe, it, expect, vi, beforeEach } from 'vitest';
import api, { checkApiHealth } from '@/lib/api';

vi.mock('axios', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    default: {
      create: vi.fn(() => ({
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn(), eject: vi.fn() },
          response: { use: vi.fn(), eject: vi.fn() },
        },
      })),
    },
  };
});

describe('API Instance & Health', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns online true and calculates latency on success', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: {} });

    const health = await checkApiHealth();

    expect(health.online).toBe(true);
    expect(health.latency).toBeGreaterThanOrEqual(0);
    expect(api.get).toHaveBeenCalledWith('/');
  });

  it('returns online false and 0 latency on failure', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Down'));

    const health = await checkApiHealth();

    expect(health.online).toBe(false);
    expect(health.latency).toBe(0);
  });
});