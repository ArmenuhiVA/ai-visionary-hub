import { useTestimonials } from "@/hooks/use-content";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedField } from "@/i18n";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

export function TestimonialsCarousel() {
  const { data: items = [] } = useTestimonials();
  const { lang } = useLanguage();
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [items.length]);

  if (!items.length) return null;
  const cur = items[idx];

  return (
    <section className="mx-auto max-w-4xl px-4 py-24 text-center">
      <div className="font-mono text-xs uppercase tracking-widest text-accent">{t("sections.testimonials")}</div>
      <div className="relative mt-10 min-h-[180px]">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={cur.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Quote className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-6 font-display text-xl md:text-2xl">{getLocalizedField(cur, "text", lang)}</p>
            <footer className="mt-6 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{cur.name}</span>
              {cur.role ? ` · ${cur.role}` : ""}
              {cur.organization ? `, ${cur.organization}` : ""}
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-accent" : "w-2 bg-muted"}`}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
