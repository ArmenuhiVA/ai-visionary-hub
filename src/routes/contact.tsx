import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AIChatWidget } from "@/components/shared/AIChatWidget";
import { ContactSection } from "@/components/home/ContactSection";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Dr. Varazdat Avetisyan" },
      { name: "description", content: "Get in touch for AI workshops, consulting, speaking engagements, and collaborations." },
      { property: "og:title", content: "Contact Dr. Varazdat Avetisyan" },
      { property: "og:description", content: "Workshops, consulting, speaking, collaborations." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  ssr: false,
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="pt-24">
        <div className="mx-auto max-w-7xl px-4 pt-8">
          <h1 className="font-display text-4xl font-bold md:text-6xl">Get in touch</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Available for workshops, consulting, university lectures, keynote talks, and AI strategy advisory.
          </p>
        </div>
        <ContactSection />
      </main>
      <SiteFooter />
      <AIChatWidget />
    </div>
  );
}
