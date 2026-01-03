import { ContactMessage } from '@/types/contactMessage';

export const createMockContactMessage = (overrides?: Partial<ContactMessage>): ContactMessage => ({
  id: 'msg-1',
  name: 'Jane Smith',
  email: 'jane@example.com',
  subject: 'Inquiry',
  message: 'Hello, I would like to collaborate.',
  isRead: false,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const mockMessageList: ContactMessage[] = [
  createMockContactMessage({ id: 'm1', isRead: true, email:'some@example.com' }),
  createMockContactMessage({ id: 'm2', name: 'John Doe', subject: 'Feedback', message: 'Great website!'  }),
];