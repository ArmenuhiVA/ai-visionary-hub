import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useCourses } from "@/hooks/use-content";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedField } from "@/i18n";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AIChatWidget } from "@/components/shared/AIChatWidget";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — Dr. Varazdat Avetisyan" },
      { name: "description", content: "AI, machine learning, deep learning, and data science courses by Dr. Varazdat Avetisyan." },
      { property: "og:title", content: "Courses by Dr. Varazdat Avetisyan" },
      { property: "og:description", content: "From AI for Everyone to Deep Learning. Programs for beginners to advanced." },
    ],
  }),
  ssr: false,
  component: Courses,
});

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"] as const;

function Courses() {
  const { data: courses = [] } = useCourses();
  const { lang } = useLanguage();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<(typeof LEVELS)[number]>("All");
  const [query, setQuery] = useState("");
  const filtered = courses.filter((c) => {
    if (filter !== "All" && c.level !== filter) return false;
    if (query && !getLocalizedField(c, "title", lang).toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pt-32 pb-20">
        <h1 className="font-display text-4xl font-bold md:text-6xl">Courses</h1>
        <p className="mt-3 text-muted-foreground">Comprehensive programs from beginner to advanced.</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setFilter(l)}
              className={`rounded-full border px-4 py-1.5 text-xs transition ${filter === l ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-accent"}`}
            >
              {l}
            </button>
          ))}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses..."
            className="ml-auto rounded-full border border-border bg-input px-4 py-1.5 text-xs outline-none focus:border-primary"
          />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to="/courses/$slug"
                params={{ slug: c.slug }}
                className="group block h-full rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50"
              >
                <span className="rounded-full border border-border px-3 py-0.5 text-xs">{t(`courses.level_${c.level}`)}</span>
                <h3 className="mt-4 font-display text-xl font-semibold">{getLocalizedField(c, "title", lang)}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{getLocalizedField(c, "description", lang)}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {c.duration}</span>
                  <span className="inline-flex items-center gap-1 text-accent group-hover:translate-x-0.5 transition">{t("courses.view")} <ArrowRight className="h-3 w-3" /></span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
      <SiteFooter />
      <AIChatWidget />
    </div>
  );
}
