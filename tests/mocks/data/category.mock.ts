import { Category } from '@/types/category';

export const createMockCategory = (overrides?: Partial<Category>): Category => ({
  id: 'cat-1',
  name: 'Default Category',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  postCount: 0,
  ...overrides,
});

export const mockCategories: Category[] = [
  createMockCategory({ id: '1', name: 'Technology', postCount: 5 }),
  createMockCategory({ id: '2', name: 'Lifestyle', postCount: 2 }),
];