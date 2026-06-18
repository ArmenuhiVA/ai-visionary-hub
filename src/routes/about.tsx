import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useProfile } from "@/hooks/use-content";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedField } from "@/i18n";
import portrait from "@/assets/varazdat-portrait.jpg";
import { AIChatWidget } from "@/components/shared/AIChatWidget";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Dr. Varazdat Avetisyan" },
      { name: "description", content: "Bio, education, expertise, and experience of Dr. Varazdat Avetisyan." },
      { property: "og:title", content: "About Dr. Varazdat Avetisyan" },
      { property: "og:description", content: "PhD in Computer Engineering, AI educator, CTO, university professor." },
    ],
  }),
  ssr: false,
  component: About,
});

function About() {
  const { data: profile } = useProfile();
  const { lang } = useLanguage();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pt-32 pb-20">
        <div className="grid gap-10 md:grid-cols-[260px_1fr]">
          <img src={profile?.photo_url || portrait} alt={profile?.name} className="h-64 w-64 rounded-2xl object-cover" />
          <div>
            <h1 className="font-display text-4xl font-bold md:text-5xl">{profile?.name}</h1>
            <p className="mt-2 text-lg text-accent">{getLocalizedField(profile, "title", lang)}</p>
            <p className="mt-2 text-sm text-muted-foreground">{profile?.location}</p>
            <div className="mt-8 prose prose-invert max-w-none whitespace-pre-wrap text-foreground/90">
              {getLocalizedField(profile, "bio", lang)}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
      <AIChatWidget />
    </div>
  );
}
