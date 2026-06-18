import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useBlogPosts } from "@/hooks/use-content";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedField } from "@/i18n";
import { motion } from "framer-motion";
import { AIChatWidget } from "@/components/shared/AIChatWidget";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Dr. Varazdat Avetisyan" },
      { name: "description", content: "Articles on AI, education, and the future of learning." },
      { property: "og:title", content: "Blog by Dr. Varazdat Avetisyan" },
      { property: "og:description", content: "Essays on AI education, LLMs, and building with AI." },
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
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50"
            >
              {p.category && <span className="text-xs text-accent">{p.category}</span>}
              <h2 className="mt-2 font-display text-xl font-semibold">{getLocalizedField(p, "title", lang)}</h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{getLocalizedField(p, "excerpt", lang)}</p>
              <p className="mt-4 text-xs text-muted-foreground">{p.published_at?.slice(0, 10)}</p>
            </motion.article>
          ))}
        </div>
      </main>
      <SiteFooter />
      <AIChatWidget />
    </div>
  );
}
