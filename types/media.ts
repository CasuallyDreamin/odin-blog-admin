export interface Media {
  id: string;
  filePath: string;
  mimeType: string;
  altText?: string;
  postId?: string | null;
  projectId?: string | null;
}

export interface PaginatedMedia {
  data: Media[];
  page: number;
  totalPages: number;
  totalItems: number;
}
