import { describe, it, expect } from 'vitest';
import { fetchTags, getTagById, createTag } from '@/lib/tagsService';

describe('tagsService', () => {
  it('fetchTags returns formatted data from the API', async () => {
    const result = await fetchTags({ page: 1, limit: 10 });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.total).toBeDefined();
    expect(result.data[0]).toHaveProperty('name');
  });

  it('getTagById returns a single tag object', async () => {
    const tag = await getTagById('tag-1');
    
    expect(tag.id).toBe('tag-1');
    expect(tag.name).toBeDefined();
  });

  it('createTag sends a POST request and returns the new tag', async () => {
    const newTag = await createTag({ name: 'Vitest' });
    
    expect(newTag.name).toBe('Vitest');
    expect(newTag).toHaveProperty('id');
  });
});