import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as contactService from '@/lib/contactService';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Contact Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchMessages', () => {
    it('calls the contact endpoint with default pagination', async () => {
      const mockData = { messages: [{ id: '1', name: 'John Doe' }], total: 1 };
      vi.mocked(api.get).mockResolvedValue({ data: mockData });

      const result = await contactService.fetchMessages(1);

      expect(api.get).toHaveBeenCalledWith('/contact', { params: { page: 1 } });
      expect(result).toEqual(mockData);
    });
  });

  describe('deleteMessage', () => {
    it('calls the delete method with the message id', async () => {
      vi.mocked(api.delete).mockResolvedValue({ status: 200 });

      await contactService.deleteMessage('msg_99');

      expect(api.delete).toHaveBeenCalledWith('/contact/msg_99');
    });
  });

  describe('markRead', () => {
    it('uses PATCH to update the read status of a message', async () => {
      vi.mocked(api.patch).mockResolvedValue({ status: 200 });

      await contactService.markRead('msg_123');

      expect(api.patch).toHaveBeenCalledWith('/contact/msg_123/read');
    });
  });

  describe('fetchUnreadMessagesCount', () => {
    it('calls the unread count endpoint and returns the count', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: { count: 12 } });

      const result = await contactService.fetchUnreadMessagesCount();

      expect(api.get).toHaveBeenCalledWith('/contact/unread/count');
      expect(result).toBe(12);
    });
  });
});