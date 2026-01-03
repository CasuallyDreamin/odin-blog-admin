import { Quote } from '@/types/quote';

export const mockQuotes: Quote[] = [
  {
    id: 'q-1',
    content: 'Code is like humor. When you have to explain it, it’s bad.',
    author: 'Cory House',
    categories: [
      { id: 'cat-1', name: 'Programming' },
      { id: 'cat-2', name: 'Humor' }
    ],
    createdAt: '2025-12-01T10:00:00Z'
  },
  {
    id: 'q-2',
    content: 'First, solve the problem. Then, write the code.',
    author: 'John Johnson',
    categories: [
      { id: 'cat-1', name: 'Programming' }
    ],
    createdAt: '2025-12-02T11:00:00Z'
  }
];