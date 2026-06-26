import { useStats } from "@/hooks/use-content";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedField } from "@/i18n";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import CountUpModule from "react-countup";
const CountUp = (CountUpModule as any).default ?? CountUpModule;
import * as Icons from "lucide-react";

export function StatsStrip() {
  const { data: stats = [] } = useStats();
  const { lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="border-y border-border bg-secondary py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s, i) => {
          const Icon =
            (Icons as unknown as Record<string, React.FC<{ className?: string }>>)[
              toPascal(s.icon ?? "Star")
            ] ?? Icons.Star;
          const numeric = parseInt(s.value, 10);
          const suffix = s.value.replace(/[0-9]/g, "");
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <Icon className="mx-auto h-6 w-6 text-accent" />
              <div className="mt-2 font-display text-3xl font-bold md:text-4xl">
                {inView && !isNaN(numeric) ? (
                  <CountUp end={numeric} duration={2} />
                ) : (
                  numeric || s.value
                )}
                {suffix}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {getLocalizedField(s, "label", lang)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function toPascal(s: string) {
  return s
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}
