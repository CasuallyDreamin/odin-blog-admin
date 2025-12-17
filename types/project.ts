export interface Tag {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Media {
  id: string;
  filePath: string;
  mimeType: string;
  altText?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  createdAt: string;
  published: boolean;
  tags: Tag[];
  categories: Category[];
  media: Media[];
}

export interface FetchProjectsResponse {
  data: Project[];
  total: number;
  page: number;
  totalPages: number;
}
