import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, MapPin, Linkedin, Github, Youtube, Send } from "lucide-react";
import { useProfile } from "@/hooks/use-content";

export function ContactSection() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert(form);
    setSubmitting(false);
    if (error) {
      toast.error(t("contact.error"));
    } else {
      toast.success(t("contact.sent"));
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-accent">{t("sections.contact")}</div>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-5xl">Let's build something together</h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            For workshops, consulting, speaking, and collaborations.
          </p>
          <div className="mt-8 space-y-3 text-sm">
            <a href={`mailto:${profile?.email}`} className="flex items-center gap-3 hover:text-accent">
              <Mail className="h-4 w-4" /> {profile?.email}
            </a>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4" /> {profile?.location}
            </div>
            <div className="flex gap-3 pt-3">
              {profile?.linkedin_url && <IconLink href={profile.linkedin_url}><Linkedin className="h-4 w-4" /></IconLink>}
              {profile?.github_url && <IconLink href={profile.github_url}><Github className="h-4 w-4" /></IconLink>}
              {profile?.youtube_url && <IconLink href={profile.youtube_url}><Youtube className="h-4 w-4" /></IconLink>}
            </div>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-border bg-card p-6">
          <input required placeholder={t("contact.name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary" />
          <input required type="email" placeholder={t("contact.email")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary" />
          <input placeholder={t("contact.subject")} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary" />
          <textarea required rows={5} placeholder={t("contact.message")} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary" />
          <button disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:scale-105 disabled:opacity-50">
            <Send className="h-4 w-4" /> {t("contact.send")}
          </button>
        </form>
      </div>
    </section>
  );
}

function IconLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="rounded-full border border-border p-2 transition hover:border-accent hover:text-accent">
      {children}
    </a>
  );
}
