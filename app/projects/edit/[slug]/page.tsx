"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Project } from "@/types/project";
import { getProjectBySlug, updateProject } from "@/lib/projectsService";
import Topbar from "@/components/admin/Topbar";
import FormField from "@/components/admin/FormField";
import { Button } from "@/components/ui/Button";

export default function EditProject() {
  const { slug } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    async function loadProject() {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await getProjectBySlug(slug);
        setProject(data);
        setTitle(data.title);
        setDescription(data.description || "");
        setContent(data.content || "");
        setPublished(data.published);
      } catch (err) {
        console.error("Failed to load project", err);
      }
      setLoading(false);
    }
    loadProject();
  }, [slug]);

  const handleSave = async () => {
    if (!project) return;
    setSaving(true);
    try {
      await updateProject(project.id, { title, description, content, published });
      router.push("/projects");
    } catch (err) {
      console.error("Failed to save project", err);
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-6">
      <Topbar title={`Edit Project: ${project?.title}`} />

      <div className="flex flex-col gap-4 max-w-3xl">
        <FormField
          label="Title"
          value={title}
          onChange={setTitle}
          required
        />

        <FormField
          label="Description"
          type="textarea"
          value={description}
          onChange={setDescription}
        />

        <FormField
          label="Content"
          type="textarea"
          value={content}
          onChange={setContent}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <span>Published</span>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Project"}
        </Button>
      </div>
    </div>
  );
}