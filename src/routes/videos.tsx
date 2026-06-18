import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AIChatWidget } from "@/components/shared/AIChatWidget";
import { useVideos } from "@/hooks/use-videos";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedField } from "@/i18n";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Clock } from "lucide-react";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Video Courses — Dr. Varazdat Avetisyan" },
      { name: "description", content: "Free video lessons on AI, Data Science, Python, Machine Learning, and Prompt Engineering." },
      { property: "og:title", content: "Video Library — Dr. Varazdat Avetisyan" },
      { property: "og:description", content: "Watch curated lessons on AI and Data Science." },
      { property: "og:url", content: "/videos" },
    ],
    links: [{ rel: "canonical", href: "/videos" }],
  }),
  ssr: false,
  component: Videos,
});

function Videos() {
  const { data: videos = [] } = useVideos();
  const { lang } = useLanguage();
  const [cat, setCat] = useState<string>("all");

  const categories = useMemo<string[]>(() => {
    const set = new Set(videos.map((v) => v.category).filter((c): c is string => !!c));
    return ["all", ...Array.from(set)];
  }, [videos]);

  const filtered = cat === "all" ? videos : videos.filter((v) => v.category === cat);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pt-32 pb-20">
        <div className="font-mono text-xs uppercase tracking-widest text-accent">// Video Library</div>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">Video Courses</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Free lessons on Artificial Intelligence, Data Science, Machine Learning, Python, and Prompt Engineering.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c as string)}
              className={`rounded-full border px-4 py-1.5 text-xs capitalize transition ${
                cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">No videos yet — check back soon.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v, i) => {
              const title = getLocalizedField(v, "title", lang);
              const desc = getLocalizedField(v, "description", lang);
              const thumb = v.thumbnail_url ?? (v.youtube_id ? `https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg` : null);
              return (
                <motion.a
                  key={v.id}
                  href={v.youtube_url}
                  target="_blank"
                  rel="noopener"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-accent"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {thumb && (
                      <img src={thumb} alt={title} className="h-full w-full object-cover transition group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition group-hover:opacity-100">
                      <Play className="h-12 w-12 fill-white text-white" />
                    </div>
                    {v.duration && (
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-background/80 px-2 py-0.5 text-xs">
                        <Clock className="h-3 w-3" /> {v.duration}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {v.category && (
                      <div className="font-mono text-[10px] uppercase tracking-widest text-accent">{v.category}</div>
                    )}
                    <h3 className="mt-1 font-display text-base font-semibold leading-snug">{title}</h3>
                    {desc && <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{desc}</p>}
                  </div>
                </motion.a>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
      <AIChatWidget />
    </div>
  );
}
