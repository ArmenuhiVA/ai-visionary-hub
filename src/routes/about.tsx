import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useProfile } from "@/hooks/use-content";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedField } from "@/i18n";
import portrait from "@/assets/professor-vetisyan.jpg.asset.json";
import cvAsset from "@/assets/VarazdatAvetisyanCV2025.pdf.asset.json";
import { AIChatWidget } from "@/components/shared/AIChatWidget";
import { CV, type CvEntry } from "@/data/cv";
import { motion } from "framer-motion";
import {
  Download,
  GraduationCap,
  Briefcase,
  History,
  Wrench,
  Languages as LanguagesIcon,
  BookOpen,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Dr. Varazdat Avetisyan" },
      {
        name: "description",
        content:
          "Bio, education, expertise and experience of Dr. Varazdat Avetisyan — PhD, AI educator, CTO.",
      },
      { property: "og:title", content: "About Dr. Varazdat Avetisyan" },
      {
        property: "og:description",
        content: "PhD in Technical Sciences, AI educator, CTO, university professor.",
      },
    ],
  }),
  ssr: false,
  component: About,
});

function About() {
  const { data: profile } = useProfile();
  const { lang } = useLanguage();
  const cv = CV[lang];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1400px] px-4 pt-28 pb-20 md:px-8">
        {/* Header card */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-[260px_1fr]">
            <img
              src={portrait.url}
              alt={profile?.name ?? "Dr. Varazdat Avetisyan"}
              className="h-64 w-64 rounded-3xl border border-accent/40 object-cover shadow-2xl"
            />
            <div>
              <h1 className="font-display text-4xl font-bold md:text-5xl">
                {profile?.name ?? "Dr. Varazdat Avetisyan"}
              </h1>
              <p className="mt-2 text-lg text-accent">
                {getLocalizedField(profile, "title", lang)}
              </p>
              <p className="mt-4 max-w-2xl text-foreground/85">
                {getLocalizedField(profile, "headline", lang)}
              </p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {profile?.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </span>
                )}
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-accent"
                  >
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </a>
                )}
                {profile?.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    {profile.phone}
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={profile?.cv_url || cvAsset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:scale-[1.03] transition"
                >
                  <Download className="h-4 w-4" /> Download CV
                </a>
                {profile?.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:border-accent"
                  >
                    LinkedIn <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Long bio */}
        {getLocalizedField(profile, "bio", lang) && (
          <Section
            icon={Sparkles}
            title={lang === "hy" ? "Իմ մասին" : lang === "ru" ? "Обо мне" : "About"}
          >
            <p className="whitespace-pre-wrap text-foreground/85 leading-relaxed">
              {getLocalizedField(profile, "bio", lang)}
            </p>
          </Section>
        )}

        <Section icon={GraduationCap} title={cv.sections.education}>
          <Timeline entries={cv.education} />
        </Section>

        <Section icon={Briefcase} title={cv.sections.experience}>
          <Timeline entries={cv.experience} />
        </Section>

        <Section icon={History} title={cv.sections.pastExperience}>
          <Timeline entries={cv.pastExperience} />
        </Section>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <SimpleCard icon={Wrench} title={cv.sections.skills}>
            <ul className="space-y-2">
              {cv.skills.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-foreground/85">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" /> {s}
                </li>
              ))}
            </ul>
          </SimpleCard>

          <SimpleCard icon={LanguagesIcon} title={cv.sections.languages}>
            <ul className="space-y-3">
              {cv.languages.map((l) => (
                <li key={l.name} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{l.name}</span>
                  <span className="text-muted-foreground">{l.level}</span>
                </li>
              ))}
            </ul>
          </SimpleCard>
        </div>

        <Section icon={BookOpen} title={cv.sections.publications}>
          <ul className="space-y-2">
            {cv.publications.map((p) => (
              <li key={p} className="flex items-start gap-2 text-foreground/85">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                {p}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Sparkles} title={cv.sections.other}>
          <ul className="space-y-2">
            {cv.other.map((p) => (
              <li key={p} className="flex items-start gap-2 text-foreground/85">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                {p}
              </li>
            ))}
          </ul>
        </Section>
      </main>
      <SiteFooter />
      <AIChatWidget />
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Sparkles;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8"
    >
      <h2 className="flex items-center gap-3 font-display text-2xl font-bold md:text-3xl">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-accent">
          <Icon className="h-5 w-5" />
        </span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </motion.section>
  );
}

function SimpleCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Sparkles;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
        <Icon className="h-5 w-5 text-accent" /> {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Timeline({ entries }: { entries: CvEntry[] }) {
  return (
    <ol className="relative border-l border-border/60 pl-6">
      {entries.map((e, i) => (
        <li key={i} className="relative pb-8 last:pb-0">
          <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-gradient-to-br from-primary to-accent ring-4 ring-background" />
          <div className="font-mono text-xs uppercase tracking-widest text-accent">{e.period}</div>
          <div className="mt-1 font-display text-lg font-semibold">{e.role}</div>
          <div className="text-sm text-muted-foreground">
            {e.url ? (
              <a
                href={e.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-accent"
              >
                {e.org} <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              e.org
            )}
          </div>
          {e.bullets && (
            <ul className="mt-3 space-y-1.5 text-sm text-foreground/80">
              {e.bullets.map((b, j) => (
                <li key={j} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 rounded-full bg-accent" /> {b}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
