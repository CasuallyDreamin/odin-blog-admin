import api from './api';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export async function fetchMessages(page = 1) {
  const res = await api.get('/contact', { params: { page } });
  return res.data;
}

export async function deleteMessage(id: string) {
  return api.delete(`/contact/${id}`);
}

export async function markRead(id: string) {
  return api.patch(`/contact/${id}/read`);
}

export async function fetchUnreadMessagesCount() {
  const res = await api.get('/contact/unread/count');
  return res.data.count;
}