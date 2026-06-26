import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useBlogPosts } from "@/hooks/use-content";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedField } from "@/i18n";
import { motion } from "framer-motion";
import { AIChatWidget } from "@/components/shared/AIChatWidget";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Dr. Varazdat Avetisyan" },
      { name: "description", content: "Articles on AI, education, and the future of learning." },
      { property: "og:title", content: "Blog by Dr. Varazdat Avetisyan" },
      {
        property: "og:description",
        content: "Essays on AI education, LLMs, and building with AI.",
      },
    ],
  }),
  ssr: false,
  component: Blog,
});

function Blog() {
  const { data: posts = [] } = useBlogPosts();
  const { lang } = useLanguage();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pt-32 pb-20">
        <h1 className="font-display text-4xl font-bold md:text-6xl">Blog</h1>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {posts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group block h-full rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50"
              >
                {p.cover_image_url && (
                  <div className="mb-4 overflow-hidden rounded-xl border border-border">
                    <img
                      src={p.cover_image_url}
                      alt={getLocalizedField(p, "title", lang)}
                      className="aspect-[16/9] w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                )}
                {p.category && <span className="text-xs text-accent">{p.category}</span>}
                <h2 className="mt-2 font-display text-xl font-semibold group-hover:text-accent transition">
                  {getLocalizedField(p, "title", lang)}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {getLocalizedField(p, "excerpt", lang)}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{p.published_at?.slice(0, 10)}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-accent opacity-0 group-hover:opacity-100 transition">
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
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
