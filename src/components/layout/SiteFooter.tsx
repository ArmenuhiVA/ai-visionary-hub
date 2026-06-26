import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, ArrowRight } from "lucide-react";

export function SiteFooter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    await supabase.from("contact_messages").insert({
      name: "Newsletter signup",
      email: email.trim(),
      subject: "Newsletter subscription",
      message: `Footer newsletter subscriber: ${email.trim()}`,
    });
    setDone(true);
    toast.success("You're subscribed!");
  };

  return (
    <footer className="border-t border-border bg-surface/40 mt-32">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="font-display text-lg font-bold text-brand-gradient">Dr. Varazdat</div>
            <p className="mt-2 text-sm text-muted-foreground">{t("footer.tagline")}</p>
            <LanguageSwitcher className="mt-4" />
          </div>
          <FooterCol
            title="Explore"
            links={[
              { to: "/", label: t("nav.home") },
              { to: "/about", label: t("nav.about") },
              { to: "/courses", label: t("nav.courses") },
              { to: "/videos", label: t("nav.videos") },
            ]}
          />
          <FooterCol
            title="More"
            links={[
              { to: "/talks", label: t("nav.talks") },
              { to: "/blog", label: t("nav.blog") },
              { to: "/companies", label: t("nav.companies") },
              { to: "/contact", label: t("sections.contact") },
            ]}
          />
          <div>
            <div className="font-display text-sm font-semibold">Stay updated</div>
            <p className="mt-2 text-xs text-muted-foreground">
              New courses and talks, direct to your inbox.
            </p>
            {done ? (
              <p className="mt-3 text-xs text-accent">✓ You're subscribed!</p>
            ) : (
              <form onSubmit={onSubscribe} className="mt-3 flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-border bg-input px-3 py-2 text-xs outline-none focus:border-primary transition"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="rounded-lg bg-primary px-2.5 py-2 text-primary-foreground transition hover:bg-primary/90"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Dr. Varazdat Avetisyan</p>
          <p>{t("footer.made")} 🇦🇲</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="font-display text-sm font-semibold">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.to + l.label}>
            <Link to={l.to} className="hover:text-foreground transition">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
