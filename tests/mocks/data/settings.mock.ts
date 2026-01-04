import { BlogSettings } from '@/lib/settingsService';

export const mockSettings: BlogSettings = {
  blogName: 'Odin Dev Blog',
  tagline: 'Thinking in code',
  logoUrl: 'https://example.com/logo.png',
  theme: 'dark',
  postsPerPage: 12,
  seoTitle: 'Odin Blog Admin',
  seoDescription: 'Manage your blog content effectively',
  socialLinks: {
    twitter: 'https://twitter.com/odin',
    github: 'https://github.com/odin'
  },
  updatedAt: new Date().toISOString(),
};