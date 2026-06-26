import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Palette } from "lucide-react";

type Color = { id: string; name: string; hex: string; is_default: boolean };
const STORAGE_KEY = "site-accent-hex";

function applyAccent(hex: string) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--accent-hex", hex);
}

export function ColorPicker() {
  const [colors, setColors] = useState<Color[]>([]);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("theme_colors")
      .select("id,name,hex,is_default")
      .order("sort_order")
      .then(({ data }) => {
        const list = (data ?? []) as Color[];
        setColors(list);
        const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
        const def = list.find((c) => c.is_default)?.hex ?? list[0]?.hex ?? null;
        const initial = saved || def;
        if (initial) {
          setCurrent(initial);
          applyAccent(initial);
        }
      });
  }, []);

  const pick = (hex: string) => {
    setCurrent(hex);
    applyAccent(hex);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, hex);
    setOpen(false);
  };

  if (colors.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
        aria-label="Choose accent color"
      >
        <Palette className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 grid w-48 grid-cols-4 gap-2 rounded-xl border border-border bg-card p-3 shadow-lg">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={() => pick(c.hex)}
              title={c.name}
              className={`h-8 w-8 rounded-full border-2 ${current === c.hex ? "border-foreground" : "border-border"}`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
