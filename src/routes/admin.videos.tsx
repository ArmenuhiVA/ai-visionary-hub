import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { MultiLangInput } from "@/components/admin/MultiLangInput";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { Plus, Trash2, Save, X, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/admin/videos")({
  ssr: false,
  component: VideosManager,
});

type Video = {
  id: string;
  youtube_url: string | null;
  youtube_id: string | null;
  thumbnail_url: string | null;
  title_hy: string | null;
  title_ru: string | null;
  title_en: string | null;
  description_hy: string | null;
  description_ru: string | null;
  description_en: string | null;
  category: string | null;
  duration: string | null;
  sort_order: number | null;
  is_published: boolean | null;
};

const CATEGORIES = [
  "AI",
  "Data Science",
  "Python",
  "Machine Learning",
  "Deep Learning",
  "Prompt Engineering",
  "Generative AI",
  "AI Agents",
];

// Extract YouTube id from many URL shapes
function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

const emptyVideo = (sortOrder: number): Video => ({
  id: "",
  youtube_url: "",
  youtube_id: null,
  thumbnail_url: null,
  title_en: "",
  title_hy: "",
  title_ru: "",
  description_en: "",
  description_hy: "",
  description_ru: "",
  category: "AI",
  duration: "",
  sort_order: sortOrder,
  is_published: true,
});

function VideosManager() {
  const qc = useQueryClient();
  const { data: videos = [] } = useQuery({
    queryKey: ["admin-videos"],
    queryFn: async () => {
      const { data } = await supabase.from("videos").select("*").order("sort_order");
      return (data ?? []) as Video[];
    },
  });
  const [editing, setEditing] = useState<Video | null>(null);

  const save = useMutation({
    mutationFn: async (v: Video) => {
      const { id, ...rest } = v;
      const payload = {
        ...rest,
        youtube_url: rest.youtube_url ?? "",
        youtube_id: extractYouTubeId(rest.youtube_url),
      };
      const { error } = id
        ? await supabase.from("videos").update(payload).eq("id", id)
        : await supabase.from("videos").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-videos"] });
      qc.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Saved");
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-videos"] });
      qc.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Deleted");
    },
  });

  const togglePublish = useMutation({
    mutationFn: async (v: Video) => {
      const { error } = await supabase
        .from("videos")
        .update({ is_published: !v.is_published })
        .eq("id", v.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-videos"] });
      qc.invalidateQueries({ queryKey: ["videos"] });
    },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Videos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage the public video library.</p>
        </div>
        <button
          onClick={() => setEditing(emptyVideo(videos.length + 1))}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add video
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Thumbnail</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {videos.map((v) => {
              const thumb =
                v.thumbnail_url ??
                (v.youtube_id ? `https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg` : null);
              return (
                <tr key={v.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3">
                    {thumb ? (
                      <img src={thumb} alt="" className="h-10 w-16 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-16 rounded bg-muted" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <div>
                      {v.title_en || <span className="text-muted-foreground">Untitled</span>}
                    </div>
                    {v.youtube_url && (
                      <a
                        href={v.youtube_url}
                        target="_blank"
                        rel="noopener"
                        className="mt-0.5 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                      >
                        YouTube <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{v.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.duration}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish.mutate(v)}
                      className={
                        v.is_published
                          ? "text-emerald-400 hover:underline"
                          : "text-muted-foreground hover:underline"
                      }
                    >
                      {v.is_published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing(v)}
                      className="rounded-md px-2 py-1 text-xs hover:bg-muted"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirm("Delete this video?") && del.mutate(v.id)}
                      className="rounded-md px-2 py-1 text-xs text-destructive hover:bg-muted"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {videos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  No videos yet — click "Add video" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <VideoEditor
          video={editing}
          onClose={() => setEditing(null)}
          onSave={(v) => save.mutate(v)}
          saving={save.isPending}
        />
      )}
    </div>
  );
}

function VideoEditor({
  video,
  onClose,
  onSave,
  saving,
}: {
  video: Video;
  onClose: () => void;
  onSave: (v: Video) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Video>(video);
  const setMulti =
    (field: "title" | "description") => (lang: "hy" | "ru" | "en", value: string) => {
      setForm((f) => ({ ...f, [`${field}_${lang}`]: value }));
    };

  const detectedId = extractYouTubeId(form.youtube_url);
  const previewThumb =
    form.thumbnail_url ??
    (detectedId ? `https://i.ytimg.com/vi/${detectedId}/hqdefault.jpg` : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{form.id ? "Edit video" : "New video"}</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              YouTube URL
            </label>
            <input
              value={form.youtube_url ?? ""}
              onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=…"
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
            />
            {detectedId && (
              <p className="mt-1 text-xs text-muted-foreground">
                Detected video id: <span className="font-mono text-accent">{detectedId}</span>
              </p>
            )}
          </div>

          {previewThumb && (
            <div className="overflow-hidden rounded-lg border border-border">
              <img
                src={previewThumb}
                alt="Thumbnail preview"
                className="aspect-video w-full object-cover"
              />
            </div>
          )}

          <ImageUpload
            bucket="video-thumbnails"
            value={form.thumbnail_url}
            onChange={(url) => setForm({ ...form, thumbnail_url: url })}
            label="Custom thumbnail (optional — falls back to YouTube)"
          />

          <MultiLangInput
            label="Title"
            values={{ hy: form.title_hy, ru: form.title_ru, en: form.title_en }}
            onChange={setMulti("title")}
          />
          <MultiLangInput
            label="Description"
            multiline
            rows={3}
            values={{ hy: form.description_hy, ru: form.description_ru, en: form.description_en }}
            onChange={setMulti("description")}
          />

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Category
              </label>
              <select
                value={form.category ?? ""}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Duration
              </label>
              <input
                value={form.duration ?? ""}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="e.g. 12:30"
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Sort order
              </label>
              <input
                type="number"
                value={form.sort_order ?? 0}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            Published (visible on the public Videos page)
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.youtube_url}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
