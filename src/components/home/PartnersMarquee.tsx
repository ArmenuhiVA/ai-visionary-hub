import { usePartners } from "@/hooks/use-content";
import { useTranslation } from "react-i18next";

export function PartnersMarquee() {
  const { data: partners = [] } = usePartners();
  const { t } = useTranslation();
  const doubled = [...partners, ...partners];

  return (
    <section className="overflow-hidden border-y border-border bg-surface/30 py-12">
      <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {t("sections.partners")}
      </p>
      <div className="relative mt-6 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex shrink-0 animate-marquee gap-12 pr-12">
          {doubled.map((p, i) => (
            <div key={`${p.id}-${i}`} className="flex h-12 shrink-0 items-center gap-3 px-6">
              {p.logo_url ? (
                <>
                  <img
                    src={p.logo_url}
                    alt={p.name}
                    className="h-10 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                  />
                  <span className="font-display text-lg font-semibold text-muted-foreground/70 whitespace-nowrap">
                    {p.name}
                  </span>
                </>
              ) : (
                <span className="font-display text-lg font-semibold text-muted-foreground/70">
                  {p.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
