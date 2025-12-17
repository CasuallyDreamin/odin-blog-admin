import api from './api';
import { Comment } from '@/types/comment'; 

export interface CommentWithPost extends Comment {
  isApproved: boolean; 
  post: {
    id: string;
    title: string;
  };
}

export interface FetchCommentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'pending' | 'approved'; 
}

export interface FetchCommentsResponse {
  data: CommentWithPost[];
  total: number;
  page: number;
  totalPages: number;
}

export async function fetchComments({ 
  page = 1, 
  limit = 10, 
  search = '', 
  status = 'pending' 
}: FetchCommentsParams): Promise<FetchCommentsResponse> {
  
  const res = await api.get('/comments', {
    params: { page, limit, search, status }
  });

  const json = res.data;

  const commentsData = json.comments ?? [];

  return {
    data: commentsData,
    total: json.total ?? 0,
    page: json.page ?? page,
    totalPages: Math.ceil((json.total ?? 0) / limit),
  };
}

export async function deleteComment(id: string): Promise<void> {
  await api.delete(`/comments/${id}`);
}

export async function setCommentApprovalStatus(id: string, isApproved: boolean): Promise<CommentWithPost> {
  const res = await api.put(`/comments/${id}/status`, { isApproved });
  return res.data as CommentWithPost;
}