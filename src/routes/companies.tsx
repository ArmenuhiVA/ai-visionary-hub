import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AIChatWidget } from "@/components/shared/AIChatWidget";
import { usePartners } from "@/hooks/use-content";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedField } from "@/i18n";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/companies")({
  head: () => ({
    meta: [
      { title: "Companies & Partners — Dr. Varazdat Avetisyan" },
      { name: "description", content: "Universities, training centers, and companies collaborating with Dr. Varazdat Avetisyan." },
      { property: "og:title", content: "Partners & Collaborations" },
      { property: "og:description", content: "Universities, academies, and companies." },
      { property: "og:url", content: "/companies" },
    ],
    links: [{ rel: "canonical", href: "/companies" }],
  }),
  ssr: false,
  component: Companies,
});

const TYPE_LABELS: Record<string, string> = {
  university: "Universities",
  training: "Training Centers",
  company: "Technology Companies",
  ngo: "NGOs & Foundations",
  organization: "Organizations",
};

function Companies() {
  const { data: partners = [] } = usePartners();
  const { lang } = useLanguage();

  const grouped = useMemo(() => {
    const map: Record<string, typeof partners> = {};
    for (const p of partners) {
      const key = p.type ?? "organization";
      (map[key] ||= []).push(p);
    }
    return map;
  }, [partners]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-20">
        <div className="font-mono text-xs uppercase tracking-widest text-accent">// Collaborations</div>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">Companies & Partners</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Universities, academies, and organizations Dr. Varazdat collaborates with across teaching, research, and consulting.
        </p>

        <div className="mt-16 space-y-16">
          {Object.entries(grouped).map(([type, items]) => (
            <section key={type}>
              <h2 className="font-display text-2xl font-semibold">
                {TYPE_LABELS[type] ?? type}
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5"
                  >
                    <div className="flex h-16 items-center">
                      {p.logo_url ? (
                        <img src={p.logo_url} alt={p.name} className="max-h-12 w-auto opacity-90" />
                      ) : (
                        <span className="font-display text-lg font-semibold text-muted-foreground">{p.name}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold">{p.name}</h3>
                      {getLocalizedField(p, "description", lang) && (
                        <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">
                          {getLocalizedField(p, "description", lang)}
                        </p>
                      )}
                    </div>
                    {p.website_url && (
                      <a
                        href={p.website_url}
                        target="_blank"
                        rel="noopener"
                        className="mt-auto inline-flex items-center gap-1 text-xs text-accent hover:underline"
                      >
                        Visit <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
          {partners.length === 0 && (
            <p className="text-center text-muted-foreground">No partners yet.</p>
          )}
        </div>
      </main>
      <SiteFooter />
      <AIChatWidget />
    </div>
  );
}
