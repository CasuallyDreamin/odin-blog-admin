export interface Tag {
  id: string;
  name: string;
  posts?: { id: string; title: string; slug: string; published: boolean; createdAt: string }[];
}
