import { useCourses } from "@/hooks/use-content";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedField } from "@/i18n";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Clock, ArrowRight } from "lucide-react";

const levelColor: Record<string, string> = {
  Beginner: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  Intermediate: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  Advanced: "bg-rose-500/15 text-rose-300 border-rose-400/30",
};

export function FeaturedCourses() {
  const { data: courses = [] } = useCourses({ featuredOnly: true });
  const { lang } = useLanguage();
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-7xl px-4 py-24">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent">// {t("sections.featured_courses")}</div>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-5xl">{t("sections.featured_courses_sub")}</h2>
        </div>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {courses.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
          >
            <Link
              to="/courses"
              className="group relative block h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition group-hover:opacity-100" />
              <span className={`inline-block rounded-full border px-3 py-0.5 text-xs ${levelColor[c.level ?? ""] ?? "border-border"}`}>
                {t(`courses.level_${c.level}`)}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">{getLocalizedField(c, "title", lang)}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{getLocalizedField(c, "description", lang)}</p>
              <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {c.duration}</span>
                <span className="inline-flex items-center gap-1 text-accent group-hover:translate-x-0.5 transition">{t("courses.view")} <ArrowRight className="h-3.5 w-3.5" /></span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
