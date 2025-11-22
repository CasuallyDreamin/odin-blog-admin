"use client";

import { useState } from "react";
import { createPost } from "@/lib/postsService";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [published, setPublished] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await createPost({
        title,
        layout: {},
        categoryIds: [],
        tagIds: [],
        published,
      });

      console.log("Created:", response);

    } catch (err: any) {
      console.error(err);
      alert("Failed to create post");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border px-3 py-2 rounded w-full"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
}
