import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { MultiLangInput } from "@/components/admin/MultiLangInput";
import { toast } from "sonner";
import { Plus, Trash2, Save, X } from "lucide-react";

export const Route = createFileRoute("/admin/talks")({
  component: TalksManager,
});

type Talk = {
  id: string;
  title_hy: string | null; title_ru: string | null; title_en: string | null;
  organization: string | null; event_date: string | null;
  city: string | null; country: string | null; country_flag: string | null;
  type: string | null;
  is_international: boolean | null; is_upcoming: boolean | null;
  description_hy: string | null; description_ru: string | null; description_en: string | null;
  is_published: boolean | null;
};

const TYPES = ["Conference Talk", "Keynote", "Workshop", "Panel Discussion", "Podcast", "Interview", "Guest Article", "Media Mention"];

function TalksManager() {
  const qc = useQueryClient();
  const { data: talks = [] } = useQuery({
    queryKey: ["admin-talks"],
    queryFn: async () => {
      const { data } = await supabase.from("talks").select("*").order("event_date", { ascending: false });
      return (data ?? []) as Talk[];
    },
  });
  const [editing, setEditing] = useState<Talk | null>(null);

  const save = useMutation({
    mutationFn: async (t: Talk) => {
      const { id, ...rest } = t;
      const { error } = id
        ? await supabase.from("talks").update(rest).eq("id", id)
        : await supabase.from("talks").insert(rest);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-talks"] });
      qc.invalidateQueries({ queryKey: ["talks"] });
      toast.success("Saved");
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("talks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-talks"] }),
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Talks & Events</h1>
        <button onClick={() => setEditing({ id: "", title_en: "", title_hy: "", title_ru: "", organization: "", event_date: new Date().toISOString().slice(0, 10), city: "", country: "", country_flag: "", type: "Conference Talk", is_international: false, is_upcoming: false, description_en: "", description_hy: "", description_ru: "", is_published: true } as Talk)} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
          <Plus className="h-4 w-4" /> Add talk
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {talks.map((t) => (
              <tr key={t.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{t.title_en}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.country_flag} {t.city}, {t.country}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.event_date}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.type}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(t)} className="rounded-md px-2 py-1 text-xs hover:bg-muted">Edit</button>
                  <button onClick={() => confirm("Delete?") && del.mutate(t.id)} className="rounded-md px-2 py-1 text-xs text-destructive hover:bg-muted">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <TalkEditor talk={editing} onClose={() => setEditing(null)} onSave={(t) => save.mutate(t)} saving={save.isPending} />}
    </div>
  );
}

function TalkEditor({ talk, onClose, onSave, saving }: { talk: Talk; onClose: () => void; onSave: (t: Talk) => void; saving: boolean }) {
  const [form, setForm] = useState<Talk>(talk);
  const setMulti = (field: "title" | "description") => (lang: "hy" | "ru" | "en", value: string) => {
    setForm({ ...form, [`${field}_${lang}`]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{form.id ? "Edit talk" : "New talk"}</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-6 space-y-4">
          <MultiLangInput label="Title" values={{ hy: form.title_hy, ru: form.title_ru, en: form.title_en }} onChange={setMulti("title")} />
          <MultiLangInput label="Description" multiline values={{ hy: form.description_hy, ru: form.description_ru, en: form.description_en }} onChange={setMulti("description")} />
          <div className="grid gap-3 md:grid-cols-2">
            <FieldInput label="Organization" value={form.organization} onChange={(v) => setForm({ ...form, organization: v })} />
            <FieldInput label="Event date" type="date" value={form.event_date} onChange={(v) => setForm({ ...form, event_date: v })} />
            <FieldInput label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
            <FieldInput label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
            <FieldInput label="Country flag emoji" value={form.country_flag} onChange={(v) => setForm({ ...form, country_flag: v })} />
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Type</label>
              <select value={form.type ?? ""} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm">
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.is_international} onChange={(e) => setForm({ ...form, is_international: e.target.checked })} /> International</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.is_upcoming} onChange={(e) => setForm({ ...form, is_upcoming: e.target.checked })} /> Upcoming</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Published</label>
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

function FieldInput({ label, value, onChange, type = "text" }: { label: string; value: string | null; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm" />
    </div>
  );
}
