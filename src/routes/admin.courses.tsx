import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { MultiLangInput } from "@/components/admin/MultiLangInput";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { Plus, Trash2, Save, X } from "lucide-react";

export const Route = createFileRoute("/admin/courses")({
  component: CoursesManager,
});

type Course = {
  id: string;
  slug: string;
  title_hy: string | null; title_ru: string | null; title_en: string | null;
  description_hy: string | null; description_ru: string | null; description_en: string | null;
  cover_image_url: string | null;
  duration: string | null;
  level: string | null;
  is_featured: boolean | null;
  is_published: boolean | null;
  sort_order: number | null;
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function CoursesManager() {
  const qc = useQueryClient();
  const { data: courses = [] } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").order("sort_order");
      return (data ?? []) as Course[];
    },
  });
  const [editing, setEditing] = useState<Course | null>(null);

  const save = useMutation({
    mutationFn: async (c: Course) => {
      const { id, ...rest } = c;
      const { error } = id
        ? await supabase.from("courses").update(rest).eq("id", id)
        : await supabase.from("courses").insert(rest);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      qc.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Saved");
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      qc.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Deleted");
    },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Courses</h1>
        <button onClick={() => setEditing({ id: "", slug: "", title_en: "", title_hy: "", title_ru: "", description_en: "", description_hy: "", description_ru: "", cover_image_url: null, duration: "", level: "Beginner", is_featured: false, is_published: true, sort_order: courses.length + 1 } as Course)} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
          <Plus className="h-4 w-4" /> Add course
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{c.title_en}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.level}</td>
                <td className="px-4 py-3">
                  {c.is_published ? <span className="text-emerald-400">Published</span> : <span className="text-muted-foreground">Draft</span>}
                  {c.is_featured && <span className="ml-2 text-accent">★ Featured</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(c)} className="rounded-md px-2 py-1 text-xs hover:bg-muted">Edit</button>
                  <button onClick={() => confirm("Delete this course?") && del.mutate(c.id)} className="rounded-md px-2 py-1 text-xs text-destructive hover:bg-muted">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <CourseEditor course={editing} onClose={() => setEditing(null)} onSave={(c) => save.mutate(c)} saving={save.isPending} slugify={slugify} />
      )}
    </div>
  );
}

function CourseEditor({ course, onClose, onSave, saving, slugify }: { course: Course; onClose: () => void; onSave: (c: Course) => void; saving: boolean; slugify: (s: string) => string }) {
  const [form, setForm] = useState<Course>(course);
  const setMulti = (field: "title" | "description") => (lang: "hy" | "ru" | "en", value: string) => {
    setForm((f) => {
      const next = { ...f, [`${field}_${lang}`]: value };
      if (field === "title" && lang === "en" && !f.id) next.slug = slugify(value);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{form.id ? "Edit course" : "New course"}</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-6 space-y-4">
          <ImageUpload bucket="course-covers" value={form.cover_image_url} onChange={(url) => setForm({ ...form, cover_image_url: url })} label="Cover image" />
          <MultiLangInput label="Title" values={{ hy: form.title_hy, ru: form.title_ru, en: form.title_en }} onChange={setMulti("title")} />
          <MultiLangInput label="Description" multiline rows={4} values={{ hy: form.description_hy, ru: form.description_ru, en: form.description_en }} onChange={setMulti("description")} />
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Slug</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Duration</label>
              <input value={form.duration ?? ""} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Level</label>
              <select value={form.level ?? ""} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Published</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">
            <Save className="h-4 w-4" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
