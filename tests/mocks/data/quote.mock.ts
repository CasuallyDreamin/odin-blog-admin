import { Quote } from '@/lib/quotesService';

export const createMockQuote = (overrides?: Partial<Quote>): Quote => ({
  id: 'q-1',
  content: 'The only limit to our realization of tomorrow is our doubts of today.',
  author: 'Franklin D. Roosevelt',
  categories: [{ id: 'cat-1', name: 'Inspiration' }],
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const mockQuoteList = {
  data: [
    createMockQuote({ id: 'q-1', content: 'First Thought', author: 'Author One' }),
    createMockQuote({ id: 'q-2', content: 'Second Thought', author: 'Author Two' }),
  ],
  total: 2,
  page: 1,
  totalPages: 1,
};