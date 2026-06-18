import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useTalks } from "@/hooks/use-content";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedField } from "@/i18n";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Globe } from "lucide-react";
import { AIChatWidget } from "@/components/shared/AIChatWidget";

export const Route = createFileRoute("/talks")({
  head: () => ({
    meta: [
      { title: "Talks & Events — Dr. Varazdat Avetisyan" },
      { name: "description", content: "Keynotes, workshops, and conference talks delivered across 15+ countries." },
      { property: "og:title", content: "Talks by Dr. Varazdat Avetisyan" },
      { property: "og:description", content: "International speaker on AI, ML, and education." },
    ],
  }),
  component: Talks,
});

function Talks() {
  const { data: talks = [] } = useTalks();
  const { lang } = useLanguage();
  const [intl, setIntl] = useState<"all" | "intl" | "local">("all");
  const filtered = talks.filter((t) => {
    if (intl === "intl") return t.is_international;
    if (intl === "local") return !t.is_international;
    return true;
  });
  const countries = new Set(talks.map((t) => t.country).filter(Boolean));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-20">
        <h1 className="font-display text-4xl font-bold md:text-6xl">Talks & Events</h1>
        <p className="mt-3 text-muted-foreground">
          {talks.length} talks across {countries.size} countries.
        </p>
        <div className="mt-8 flex gap-2">
          {(["all", "intl", "local"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setIntl(k)}
              className={`rounded-full border px-4 py-1.5 text-xs ${intl === k ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
            >
              {k === "all" ? "All" : k === "intl" ? "International" : "Local"}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-4">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-2xl">{t.country_flag}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {t.city}, {t.country}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {t.event_date}</span>
                  {t.is_international && <span className="inline-flex items-center gap-1 text-accent"><Globe className="h-3 w-3" /> Intl</span>}
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold">{getLocalizedField(t, "title", lang)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.organization} · {t.type}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <SiteFooter />
      <AIChatWidget />
    </div>
  );
}
