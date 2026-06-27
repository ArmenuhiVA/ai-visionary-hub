import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AIChatWidget } from "@/components/shared/AIChatWidget";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedField } from "@/i18n";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

export const Route = createFileRoute("/blog_/$slug")({
  ssr: false,
  component: BlogPost,
  notFoundComponent: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pt-32 pb-20 text-center">
        <h1 className="font-display text-4xl font-bold">Post not found</h1>
        <p className="mt-3 text-muted-foreground">This article doesn't exist or has been removed.</p>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </main>
      <SiteFooter />
    </div>
  ),
});

function BlogPost() {
  const { slug } = Route.useParams();
  const { lang } = useLanguage();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog_post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 pt-32 pb-20">
          <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
          <div className="mt-6 h-10 w-full animate-pulse rounded bg-muted" />
          <div className="mt-3 h-6 w-2/3 animate-pulse rounded bg-muted" />
          <div className="mt-12 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-muted" style={{ width: `${85 + Math.random() * 15}%` }} />
            ))}
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!post) return null;

  const title = getLocalizedField(post, "title", lang);
  const content = getLocalizedField(post, "content", lang);
  const excerpt = getLocalizedField(post, "excerpt", lang);
  const tags: string[] = Array.isArray(post.tags) ? (post.tags as string[]) : [];
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString(
        lang === "hy" ? "hy-AM" : lang === "ru" ? "ru-RU" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : null;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All articles
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {post.category && (
              <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-0.5 text-accent">
                {post.category}
              </span>
            )}
            {publishedDate && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> {publishedDate}
              </span>
            )}
          </div>

          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] md:text-5xl">{title}</h1>

          {excerpt && (
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground border-l-2 border-accent pl-4">
              {excerpt}
            </p>
          )}

          {post.cover_image_url && (
            <div className="mt-10 overflow-hidden rounded-2xl border border-border">
              <img
                src={post.cover_image_url}
                alt={title}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          )}

          {content ? (
            <div className="mt-10 prose prose-invert prose-lg max-w-none
              prose-headings:font-display prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-foreground/85 prose-p:leading-relaxed
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-code:text-accent prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-sm
              prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl
              prose-blockquote:border-l-accent prose-blockquote:text-muted-foreground
              prose-ul:text-foreground/85 prose-ol:text-foreground/85
              prose-li:my-1
            ">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          ) : (
            <p className="mt-10 text-muted-foreground italic">Full article content coming soon.</p>
          )}

          {tags.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border pt-8">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border px-3 py-0.5 text-xs text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Enjoyed this article?</p>
            <Link
              to="/contact"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:scale-[1.03]"
            >
              Get in touch
            </Link>
          </div>
        </motion.div>
      </main>
      <SiteFooter />
      <AIChatWidget />
    </div>
  );
}
