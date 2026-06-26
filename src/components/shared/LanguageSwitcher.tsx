import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Lang = { code: string; label: string; flag: string | null };

const FALLBACK: Lang[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hy", label: "Հայերեն", flag: "🇦🇲" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  const [langs, setLangs] = useState<Lang[]>(FALLBACK);

  useEffect(() => {
    supabase
      .from("site_languages")
      .select("code,label,flag")
      .eq("enabled", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) setLangs(data as Lang[]);
      });
  }, []);

  return (
    <div className={cn("inline-flex items-center gap-1 rounded-full border border-border bg-surface/60 p-1", className)}>
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code as any)}
          aria-label={l.label}
          title={l.label}
          className={cn(
            "h-7 min-w-7 rounded-full px-2 text-base leading-none transition",
            lang === l.code ? "bg-primary text-primary-foreground scale-110" : "hover:bg-muted",
          )}
        >
          {l.flag || l.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
