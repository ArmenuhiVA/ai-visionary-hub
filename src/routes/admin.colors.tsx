import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Star } from "lucide-react";

export const Route = createFileRoute("/admin/colors")({
  ssr: false,
  component: ColorsPage,
});

type Color = { id: string; name: string; hex: string; is_default: boolean; sort_order: number };

function ColorsPage() {
  const [rows, setRows] = useState<Color[]>([]);
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#06b6d4");

  const load = async () => {
    const { data } = await supabase.from("theme_colors").select("*").order("sort_order");
    setRows((data ?? []) as Color[]);
  };
  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("theme_colors")
      .insert({ name: name.trim(), hex, sort_order: rows.length + 1 });
    if (error) return toast.error(error.message);
    toast.success("Color added");
    setName("");
    setHex("#06b6d4");
    load();
  };

  const setDefault = async (id: string) => {
    await supabase.from("theme_colors").update({ is_default: false }).neq("id", id);
    await supabase.from("theme_colors").update({ is_default: true }).eq("id", id);
    toast.success("Default updated");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this color?")) return;
    const { error } = await supabase.from("theme_colors").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display text-3xl font-bold">Theme Colors</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Add accent colors that visitors can choose.
      </p>

      <form
        onSubmit={add}
        className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-6 sm:grid-cols-[1fr_100px_auto]"
      >
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Color name"
          className="rounded-lg border border-border bg-input px-3 py-2 text-sm"
        />
        <input
          type="color"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-input"
        />
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {rows.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <div
              className="h-10 w-10 shrink-0 rounded-lg border border-border"
              style={{ backgroundColor: c.hex }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.hex}</div>
            </div>
            <button
              onClick={() => setDefault(c.id)}
              title="Set as default"
              className={
                c.is_default ? "text-amber-500" : "text-muted-foreground hover:text-foreground"
              }
            >
              <Star className="h-4 w-4" fill={c.is_default ? "currentColor" : "none"} />
            </button>
            <button onClick={() => remove(c.id)} className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
