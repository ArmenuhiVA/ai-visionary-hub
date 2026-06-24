import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useTalks } from "@/hooks/use-content";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedField } from "@/i18n";
import { motion } from "framer-motion";
import { Calendar, MapPin, Globe, Mic, Users, Headphones, MessageSquare, FileText, Newspaper } from "lucide-react";
import { AIChatWidget } from "@/components/shared/AIChatWidget";

export const Route = createFileRoute("/talks")({
  head: () => ({
    meta: [
      { title: "Talks & Events — Dr. Varazdat Avetisyan" },
      { name: "description", content: "Keynotes, workshops, panels, podcasts and interviews delivered across 15+ countries." },
      { property: "og:title", content: "Talks by Dr. Varazdat Avetisyan" },
      { property: "og:description", content: "International speaker on AI, ML, and education." },
    ],
  }),
  ssr: false,
  component: Talks,
});

const SECTIONS: { key: string; title: string; types: string[]; icon: typeof Mic }[] = [
  { key: "talks", title: "Talks", types: ["Conference Talk", "Keynote", "Workshop"], icon: Mic },
  { key: "panels", title: "Panels", types: ["Panel Discussion"], icon: Users },
  { key: "podcasts", title: "Podcasts", types: ["Podcast"], icon: Headphones },
  { key: "interviews", title: "Interviews", types: ["Interview"], icon: MessageSquare },
  { key: "articles", title: "Commentaries, Guest Posts, and Other Articles", types: ["Guest Article"], icon: FileText },
  { key: "mentions", title: "Mentions", types: ["Media Mention"], icon: Newspaper },
];

function Talks() {
  const { data: talks = [] } = useTalks();
  const { lang } = useLanguage();
  const countries = new Set(talks.map((t) => t.country).filter(Boolean));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-20">
        <h1 className="font-display text-4xl font-bold md:text-6xl">Talks & Events</h1>
        <p className="mt-3 text-muted-foreground">
          {talks.length} appearances across {countries.size} countries.
        </p>

        <nav className="mt-8 flex flex-wrap gap-2">
          {SECTIONS.map((s) => {
            const count = talks.filter((t) => s.types.includes(t.type ?? "")).length;
            if (!count) return null;
            return (
              <a
                key={s.key}
                href={`#${s.key}`}
                className="rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-foreground"
              >
                {s.title} <span className="text-muted-foreground/60">({count})</span>
              </a>
            );
          })}
        </nav>

        <div className="mt-12 space-y-16">
          {SECTIONS.map((section) => {
            const items = talks
              .filter((t) => section.types.includes(t.type ?? ""))
              .sort((a, b) => (b.event_date ?? "").localeCompare(a.event_date ?? ""));
            if (!items.length) return null;
            const Icon = section.icon;
            return (
              <section key={section.key} id={section.key} className="scroll-mt-24">
                <div className="mb-6 flex items-center gap-3 border-b border-border pb-3">
                  <Icon className="h-5 w-5 text-accent" />
                  <h2 className="font-display text-2xl font-bold md:text-3xl">{section.title}</h2>
                  <span className="ml-auto text-xs text-muted-foreground">{items.length}</span>
                </div>
                <div className="grid gap-4">
                  {items.map((t, i) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                      className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40"
                    >
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {t.country_flag && <span className="text-xl leading-none">{t.country_flag}</span>}
                        {(t.city || t.country) && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {[t.city, t.country].filter(Boolean).join(", ")}
                          </span>
                        )}
                        {t.event_date && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {t.event_date}
                          </span>
                        )}
                        {t.is_international && (
                          <span className="inline-flex items-center gap-1 text-accent">
                            <Globe className="h-3 w-3" /> Intl
                          </span>
                        )}
                        {t.is_upcoming && (
                          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-accent">Upcoming</span>
                        )}
                      </div>
                      <h3 className="mt-2 font-display text-lg font-semibold">{getLocalizedField(t, "title", lang)}</h3>
                      {t.organization && (
                        <p className="mt-1 text-sm text-muted-foreground">{t.organization}</p>
                      )}
                      {getLocalizedField(t, "description", lang) && (
                        <p className="mt-2 text-sm text-muted-foreground/90">{getLocalizedField(t, "description", lang)}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}

          {talks.length === 0 && (
            <p className="text-muted-foreground">No entries yet.</p>
          )}
        </div>
      </main>
      <SiteFooter />
      <AIChatWidget />
    </div>
  );
}
