import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AIChatWidget } from "@/components/shared/AIChatWidget";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedField } from "@/i18n";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Calendar,
  Clock,
  GraduationCap,
  User,
  Wrench,
  Target,
  ListChecks,
  CalendarClock,
} from "lucide-react";

export const Route = createFileRoute("/courses/$slug")({
  ssr: false,
  component: CourseDetail,
  notFoundComponent: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pt-32 pb-20 text-center">
        <h1 className="font-display text-4xl font-bold">Course not found</h1>
        <p className="mt-3 text-muted-foreground">The course you're looking for doesn't exist.</p>
        <Link
          to="/courses"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </Link>
      </main>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pt-32 pb-20 text-center">
        <h1 className="font-display text-3xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">{error.message}</p>
      </main>
      <SiteFooter />
    </div>
  ),
});

const levelColor: Record<string, string> = {
  Beginner: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  Intermediate: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  Advanced: "bg-rose-500/15 text-rose-300 border-rose-400/30",
};

function CourseDetail() {
  const { slug } = Route.useParams();
  const { lang } = useLanguage();
  const { t } = useTranslation();

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
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
        <main className="mx-auto max-w-5xl px-4 pt-32 pb-20">
          <div className="h-8 w-1/2 animate-pulse rounded bg-muted" />
          <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="mt-10 h-64 animate-pulse rounded-2xl bg-muted" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!course) return null;

  const title = getLocalizedField(course, "title", lang);
  const description = getLocalizedField(course, "description", lang);
  const schedule = getLocalizedField(course, "schedule", lang);
  const prerequisites = getLocalizedField(course, "prerequisites", lang);
  const outcomesRaw =
    (course as Record<string, unknown>)[`outcomes_${lang}`] ??
    (course as Record<string, unknown>).outcomes_en;
  const outcomes: string[] = Array.isArray(outcomesRaw) ? (outcomesRaw as string[]) : [];
  const tools: string[] = Array.isArray(course.tools) ? (course.tools as string[]) : [];
  const startDate = course.start_date
    ? new Date(course.start_date).toLocaleDateString(
        lang === "hy" ? "hy-AM" : lang === "ru" ? "ru-RU" : "en-US",
        { year: "numeric", month: "long", day: "numeric" },
      )
    : null;
  const enrollHref = course.enrollment_url || "/contact";
  const isInternalEnroll = enrollHref.startsWith("/");

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-20">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All courses
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-3">
          {/* Main */}
          <article className="lg:col-span-2">
            {course.cover_image_url && (
              <div className="mb-8 overflow-hidden rounded-2xl border border-border">
                <img
                  src={course.cover_image_url}
                  alt={title}
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-3 py-0.5 text-xs ${levelColor[course.level ?? ""] ?? "border-border"}`}
              >
                {t(`courses.level_${course.level}`)}
              </span>
              {course.duration && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-0.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {course.duration}
                </span>
              )}
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold md:text-5xl">{title}</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>

            {outcomes.length > 0 && (
              <Section icon={<Target className="h-5 w-5 text-accent" />} title="Skills & outcomes">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {outcomes.map((o, i) => (
                    <li
                      key={i}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
                    >
                      {o}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {tools.length > 0 && (
              <Section
                icon={<Wrench className="h-5 w-5 text-accent" />}
                title="Tools & technologies"
              >
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-border bg-card px-3 py-1 text-xs"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {prerequisites && (
              <Section icon={<ListChecks className="h-5 w-5 text-accent" />} title="Requirements">
                <p className="text-sm text-muted-foreground">{prerequisites}</p>
              </Section>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold">Course details</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <InfoRow
                  icon={<GraduationCap className="h-4 w-4" />}
                  label="Level"
                  value={t(`courses.level_${course.level}`)}
                />
                <InfoRow
                  icon={<Clock className="h-4 w-4" />}
                  label="Duration"
                  value={course.duration ?? "—"}
                />
                {startDate && (
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Start date"
                    value={startDate}
                  />
                )}
                {course.instructor && (
                  <InfoRow
                    icon={<User className="h-4 w-4" />}
                    label="Instructor"
                    value={course.instructor}
                  />
                )}
                {schedule && (
                  <InfoRow
                    icon={<CalendarClock className="h-4 w-4" />}
                    label="Schedule"
                    value={schedule}
                  />
                )}
              </dl>

              {isInternalEnroll ? (
                <Link
                  to={enrollHref}
                  className="mt-6 block w-full rounded-full bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  Enroll now
                </Link>
              ) : (
                <a
                  href={enrollHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block w-full rounded-full bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  Enroll now
                </a>
              )}
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
      <AIChatWidget />
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
        {icon} {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="min-w-0 flex-1">
        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 break-words text-sm font-medium">{value}</dd>
      </div>
    </div>
  );
}
