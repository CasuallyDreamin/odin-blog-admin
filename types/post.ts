import { Comment } from './comment';
import { Category } from './category';

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  published: boolean;
  tags: string[];
  categories: Category[];
  layout?: {
    pinned?: boolean;
    div?: {
      p?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}
