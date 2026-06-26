import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { NeuralHero } from "@/components/home/NeuralHero";
import { StatsStrip } from "@/components/home/StatsStrip";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { LearningPathQuiz } from "@/components/home/LearningPathQuiz";
import { TalksWorldMap } from "@/components/home/TalksWorldMap";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { ContactSection } from "@/components/home/ContactSection";
import { AIChatWidget } from "@/components/shared/AIChatWidget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dr. Varazdat Avetisyan — AI Educator, CTO & International Speaker" },
      {
        name: "description",
        content:
          "Empowering the next generation of AI professionals. Courses, talks, and research from Yerevan, Armenia.",
      },
      { property: "og:title", content: "Dr. Varazdat Avetisyan — AI Educator" },
      {
        property: "og:description",
        content: "PhD in Computer Engineering. 5,000+ students trained. 100+ workshops.",
      },
    ],
  }),
  ssr: false,
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <NeuralHero />
        <StatsStrip />
        <FeaturedCourses />
        <LearningPathQuiz />
        <TalksWorldMap />
        <PartnersMarquee />
        <TestimonialsCarousel />
        <NewsletterSignup />
        <ContactSection />
      </main>
      <SiteFooter />
      <AIChatWidget />
    </div>
  );
}
