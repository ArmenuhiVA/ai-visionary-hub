import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

const FLAGS: Record<string, { flag: string; label: string }> = {
  hy: { flag: "🇦🇲", label: "Հայերեն" },
  ru: { flag: "🇷🇺", label: "Русский" },
  en: { flag: "🇬🇧", label: "English" },
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-full border border-border bg-surface/60 p-1", className)}>
      {(["hy", "ru", "en"] as const).map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-label={FLAGS[code].label}
          className={cn(
            "h-7 w-7 rounded-full text-base leading-none transition",
            lang === code ? "bg-primary text-primary-foreground scale-110" : "hover:bg-muted",
          )}
        >
          {FLAGS[code].flag}
        </button>
      ))}
    </div>
  );
}
