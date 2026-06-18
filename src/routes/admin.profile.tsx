import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MultiLangInput } from "@/components/admin/MultiLangInput";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { Save } from "lucide-react";

export const Route = createFileRoute("/admin/profile")({
  component: ProfileEditor,
});

type ProfileRow = {
  id: string;
  name: string;
  title_hy: string | null; title_ru: string | null; title_en: string | null;
  headline_hy: string | null; headline_ru: string | null; headline_en: string | null;
  bio_hy: string | null; bio_ru: string | null; bio_en: string | null;
  photo_url: string | null; cv_url: string | null;
  email: string | null; phone: string | null; location: string | null;
  linkedin_url: string | null; github_url: string | null; facebook_url: string | null; instagram_url: string | null; youtube_url: string | null;
};

function ProfileEditor() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const { data } = await supabase.from("profile").select("*").limit(1).maybeSingle();
      return data as ProfileRow | null;
    },
  });
  const [form, setForm] = useState<ProfileRow | null>(null);
  useEffect(() => { if (data) setForm(data); }, [data]);
  const [saving, setSaving] = useState(false);

  if (!form) return <div className="p-8 text-muted-foreground">Loading…</div>;

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("profile").update(form).eq("id", form.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["admin-profile"] });
    }
  };

  const setMulti = (field: "title" | "headline" | "bio") => (lang: "hy" | "ru" | "en", value: string) => {
    setForm({ ...form, [`${field}_${lang}`]: value });
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Profile</h1>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="mt-8 space-y-5">
        <ImageUpload bucket="profile-images" value={form.photo_url} onChange={(url) => setForm({ ...form, photo_url: url })} label="Profile photo" />
        <ImageUpload bucket="cv-documents" value={form.cv_url} onChange={(url) => setForm({ ...form, cv_url: url })} label="CV (PDF)" />

        <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <MultiLangInput label="Title" values={{ hy: form.title_hy, ru: form.title_ru, en: form.title_en }} onChange={setMulti("title")} />
        <MultiLangInput label="Headline" values={{ hy: form.headline_hy, ru: form.headline_ru, en: form.headline_en }} onChange={setMulti("headline")} />
        <MultiLangInput label="Bio" multiline rows={6} values={{ hy: form.bio_hy, ru: form.bio_ru, en: form.bio_en }} onChange={setMulti("bio")} />

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          <Field label="LinkedIn URL" value={form.linkedin_url} onChange={(v) => setForm({ ...form, linkedin_url: v })} />
          <Field label="GitHub URL" value={form.github_url} onChange={(v) => setForm({ ...form, github_url: v })} />
          <Field label="YouTube URL" value={form.youtube_url} onChange={(v) => setForm({ ...form, youtube_url: v })} />
          <Field label="Facebook URL" value={form.facebook_url} onChange={(v) => setForm({ ...form, facebook_url: v })} />
          <Field label="Instagram URL" value={form.instagram_url} onChange={(v) => setForm({ ...form, instagram_url: v })} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string | null; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary" />
    </div>
  );
}
