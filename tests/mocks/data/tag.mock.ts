import { Tag } from "@/types/tag";

export const createMockTag = (overrides?: Partial<Tag>): Tag => ({
  id: 't-1',
  name: 'React',
  posts: [
    { id: 'p-1', title: 'Post One', slug: 'post-one', published: true, createdAt: new Date().toISOString() }
  ],
  ...overrides,
});

export const mockTagList = {
  data: [
    createMockTag({ id: 't-1', name: 'React' }),
    createMockTag({ id: 't-2', name: 'TypeScript', posts: [] }),
    createMockTag({ id: 't-3', name: 'Node.js' }),
  ],
};