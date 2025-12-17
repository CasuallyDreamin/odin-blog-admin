import api from './api';

export interface BlogSettings {
  blogName: string;
  tagline: string;
  logoUrl: string | null;
  theme: 'default' | 'light' | 'dark' | string;
  postsPerPage: number;
  seoTitle: string | null;
  seoDescription: string | null;
  socialLinks: Record<string, string> | null;
  updatedAt: string;
}

export type UpdateSettingsPayload = Partial<Omit<BlogSettings, 'updatedAt'>>;

export async function fetchSettings(): Promise<BlogSettings> {
  const res = await api.get('/settings');
  return res.data as BlogSettings;
}

export async function updateSettings(data: UpdateSettingsPayload): Promise<BlogSettings> {
  const res = await api.put('/settings', data);
  return res.data as BlogSettings;
}