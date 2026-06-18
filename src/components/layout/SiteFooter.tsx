import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-surface/40 mt-32">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="font-display text-lg font-bold text-brand-gradient">Dr. Varazdat</div>
            <p className="mt-2 text-sm text-muted-foreground">{t("footer.tagline")}</p>
            <LanguageSwitcher className="mt-4" />
          </div>
          <FooterCol title="Pages" links={[
            { to: "/", label: t("nav.home") },
            { to: "/about", label: t("nav.about") },
            { to: "/courses", label: t("nav.courses") },
          ]} />
          <FooterCol title="Teaching" links={[
            { to: "/courses", label: t("nav.courses") },
            { to: "/talks", label: t("nav.talks") },
          ]} />
          <FooterCol title="Connect" links={[
            { to: "/blog", label: t("nav.blog") },
            { to: "/#contact", label: t("sections.contact") },
            { to: "/admin", label: t("nav.admin") },
          ]} />
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© 2025 Dr. Varazdat Avetisyan</p>
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
            <Link to={l.to} className="hover:text-foreground">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
