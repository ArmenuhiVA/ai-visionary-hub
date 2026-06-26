import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/languages")({
  ssr: false,
  component: LanguagesPage,
});

type Lang = { id: string; code: string; label: string; flag: string | null; enabled: boolean; sort_order: number };

function LanguagesPage() {
  const [rows, setRows] = useState<Lang[]>([]);
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [flag, setFlag] = useState("");

  const load = async () => {
    const { data } = await supabase.from("site_languages").select("*").order("sort_order");
    setRows((data ?? []) as Lang[]);
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("site_languages").insert({
      code: code.toLowerCase().trim(),
      label: label.trim(),
      flag: flag.trim() || null,
      sort_order: rows.length + 1,
    });
    if (error) return toast.error(error.message);
    toast.success("Language added");
    setCode(""); setLabel(""); setFlag("");
    load();
  };

  const update = async (id: string, patch: Partial<Lang>) => {
    const { error } = await supabase.from("site_languages").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this language?")) return;
    const { error } = await supabase.from("site_languages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display text-3xl font-bold">Languages</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage site languages.</p>

      <form onSubmit={add} className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-6 sm:grid-cols-[80px_1fr_80px_auto]">
        <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code" className="rounded-lg border border-border bg-input px-3 py-2 text-sm" />
        <input required value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" className="rounded-lg border border-border bg-input px-3 py-2 text-sm" />
        <input value={flag} onChange={(e) => setFlag(e.target.value)} placeholder="🇬🇧" className="rounded-lg border border-border bg-input px-3 py-2 text-sm" />
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"><Plus className="h-4 w-4" /> Add</button>
      </form>

      <div className="mt-6 space-y-2">
        {rows.map((l) => (
          <div key={l.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
            <span className="w-10 text-center text-xl">{l.flag}</span>
            <input
              value={l.label}
              onChange={(e) => setRows((r) => r.map((x) => x.id === l.id ? { ...x, label: e.target.value } : x))}
              onBlur={(e) => update(l.id, { label: e.target.value })}
              className="flex-1 rounded border border-border bg-input px-2 py-1 text-sm"
            />
            <span className="text-xs text-muted-foreground">{l.code}</span>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={l.enabled} onChange={(e) => update(l.id, { enabled: e.target.checked })} />
              Enabled
            </label>
            <button onClick={() => remove(l.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
