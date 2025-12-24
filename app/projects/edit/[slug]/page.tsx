"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Project } from "@/types/project";
import { getProjectBySlug, updateProject } from "@/lib/projectsService";
import { fetchTags } from "@/lib/tagsService";
import { fetchCategories } from "@/lib/categoriesService";
import Topbar from "@/components/admin/Topbar";
import FormField from "@/components/admin/FormField";
import { Button } from "@/components/ui/Button";
import TextEditor from "@/components/posts/TextEditor";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

export default function EditProject() {
  const { slug } = useParams();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;

      try {
        const [proj, catsRes, tagsRes] = await Promise.all([
          getProjectBySlug(slug as string),
          fetchCategories({ limit: 100 }),
          fetchTags({ limit: 100 }),
        ]);

        setProject(proj);
        setTitle(proj.title);
        setDescription(proj.description || "");
        setContent(proj.content || "");
        setPublished(proj.published);
        setSelectedTags(proj.tags?.map((t) => t.id) || []);
        setSelectedCategories(proj.categories?.map((c) => c.id) || []);

        setAvailableCategories(catsRes.data || []);
        setAvailableTags(tagsRes.data || []);
      } catch (err) {
        console.error("Failed to load project data", err);
        setError("Failed to load project data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  const handleCategoryChange = (id: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleTagChange = (id: string, checked: boolean) => {
    setSelectedTags((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleSave = async () => {
    setError(null);

    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }
    if (!content.trim() || content === "<p><br></p>") {
      setError("Project content cannot be empty.");
      return;
    }

    if (!project) return;
    setSaving(true);

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const firstParagraph = tempDiv.querySelector("p")?.textContent || "";
    const generatedPreview = firstParagraph.substring(0, 180).trim();

    try {
      await updateProject(project.id, {
        title,
        description,
        content,
        preview: generatedPreview,
        published,
        tagIds: selectedTags,
        categoryIds: selectedCategories,
      });
      router.push("/projects");
    } catch (err) {
      setError("Server error: Failed to save project.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-cyan-500">Loading project...</div>;

  return (
    <div className="flex flex-col gap-6 pb-20 bg-neutral-900 min-h-screen text-neutral-100">
      <Topbar title={`Edit Project: ${project?.title}`} />

      <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full px-4">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <FormField label="Title" value={title} onChange={setTitle} required />
            <FormField
              label="Description"
              type="textarea"
              value={description}
              onChange={setDescription}
            />
            
            <div className="flex items-center space-x-3 bg-neutral-800 p-4 rounded-lg border border-neutral-700">
              <input
                id="published-checkbox"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-5 w-5 text-cyan-500 rounded border-gray-600 focus:ring-cyan-500"
              />
              <label htmlFor="published-checkbox" className="text-lg font-medium select-none">
                Published
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
              <h3 className="text-sm font-semibold mb-3 text-cyan-300 uppercase tracking-wider">Categories</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                {availableCategories.map((cat) => (
                  <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={(e) => handleCategoryChange(cat.id, e.target.checked)}
                      className="rounded text-cyan-500 border-gray-600"
                    />
                    <span className="text-sm text-gray-200">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
              <h3 className="text-sm font-semibold mb-3 text-cyan-300 uppercase tracking-wider">Tags</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                {availableTags.map((tag) => (
                  <label key={tag.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={(e) => handleTagChange(tag.id, e.target.checked)}
                      className="rounded text-cyan-500 border-gray-600"
                    />
                    <span className="text-sm text-gray-200">{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <label className="font-semibold text-cyan-300 uppercase tracking-wider text-sm">Content</label>
          <div className="min-h-[400px] border border-neutral-700 rounded-lg overflow-hidden bg-neutral-800">
            <TextEditor value={content} onChange={setContent} readOnly={saving} />
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.back()} disabled={saving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-8"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}