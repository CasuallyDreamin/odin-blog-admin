export interface Quote {
  id: string;
  content: string;
  author?: string;
  categories?: { id: string; name: string }[];
  createdAt: string;
}
