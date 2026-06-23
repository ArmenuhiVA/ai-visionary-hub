import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import { useProfile } from "@/hooks/use-content";
import { getLocalizedField } from "@/i18n";
import { Link } from "@tanstack/react-router";
import portrait from "@/assets/professor-vetisyan.jpg.asset.json";
import cvAsset from "@/assets/VarazdatAvetisyanCV2025.pdf.asset.json";
import { Download, ArrowRight, ChevronDown } from "lucide-react";

export function NeuralHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const { data: profile } = useProfile();
  const roles = t("hero.roles", { returnObjects: true }) as string[];
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 2400);
    return () => clearInterval(id);
  }, [roles.length]);

  // Neural network canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    const N = 70;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, w(), h());
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w()) n.vx *= -1;
        if (n.y < 0 || n.y > h()) n.vy *= -1;
      }
      // lines
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 140) {
            const a = (1 - d / 140) * 0.35;
            ctx.strokeStyle = `rgba(109, 178, 217, ${a})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      // dots
      for (const n of nodes) {
        ctx.fillStyle = "rgba(160, 120, 240, 0.85)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const name = profile?.name ?? "Dr. Varazdat Avetisyan";
  const headline = getLocalizedField(profile, "headline", lang) || "Empowering the Next Generation of AI Professionals";

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-brand-gradient">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/0 to-background" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-8 px-4 pt-28 pb-20 md:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 font-mono text-xs text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Yerevan, Armenia
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] md:text-7xl">
              {name.split(" ").slice(0, 2).join(" ")}{" "}
              <span className="text-brand-gradient">
                {name.split(" ").slice(2).join(" ")}
              </span>
            </h1>
            <div className="mt-4 h-9 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={roleIdx}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="font-mono text-lg text-accent md:text-xl"
                >
                  {roles[roleIdx]}
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">{headline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/courses"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:scale-[1.03] glow-shadow"
              >
                {t("hero.cta_courses")}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <a
                href={profile?.cv_url || cvAsset.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-accent px-6 py-3 font-medium text-accent transition hover:bg-accent/10"
              >
                <Download className="h-4 w-4" />
                {t("hero.cta_cv")}
              </a>
            </div>
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-primary via-accent to-primary opacity-50 blur-2xl" />
            <div className="animate-float">
              <div className="animate-pulse-ring rounded-full">
                <img
                  src={profile?.photo_url || portrait.url}
                  alt={name}
                  width={400}
                  height={400}
                  className="relative h-72 w-72 rounded-full border-2 border-accent/50 object-cover md:h-96 md:w-96"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground">
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </div>
    </section>
  );
}
