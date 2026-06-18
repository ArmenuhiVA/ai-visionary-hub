import { useState } from "react";
import { cn } from "@/lib/utils";

const LANGS = [
  { code: "hy" as const, flag: "🇦🇲" },
  { code: "ru" as const, flag: "🇷🇺" },
  { code: "en" as const, flag: "🇬🇧" },
];

export function MultiLangInput({
  label,
  values,
  onChange,
  multiline = false,
  rows = 3,
}: {
  label: string;
  values: { hy?: string | null; ru?: string | null; en?: string | null };
  onChange: (lang: "hy" | "ru" | "en", value: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const [active, setActive] = useState<"hy" | "ru" | "en">("en");
  const Field = multiline ? "textarea" : "input";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <div className="flex gap-1">
          {LANGS.map((l) => (
            <button
              type="button"
              key={l.code}
              onClick={() => setActive(l.code)}
              className={cn(
                "rounded px-1.5 text-base",
                active === l.code ? "bg-primary/20" : "opacity-50 hover:opacity-100",
              )}
            >
              {l.flag}
            </button>
          ))}
        </div>
      </div>
      <Field
        rows={multiline ? rows : undefined}
        value={values[active] ?? ""}
        onChange={(e) => onChange(active, e.target.value)}
        className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
