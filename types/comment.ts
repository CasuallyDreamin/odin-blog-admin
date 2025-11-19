export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorEmail?: string;
  body: string;
  createdAt: string;
  published: boolean;
}
