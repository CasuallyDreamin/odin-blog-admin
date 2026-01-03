import { Settings } from '@/types/settings';

export const createMockSettings = (overrides?: Partial<Settings>): Settings => ({
  id: 'settings-id-1',
  siteTitle: 'Sintopia Admin',
  siteDescription: 'A professional blog management dashboard.',
  quote: 'The code is the message.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const mockSettings = createMockSettings();