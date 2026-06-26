import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCourses } from "@/hooks/use-content";
import { useLanguage } from "@/hooks/use-language";
import { getLocalizedField } from "@/i18n";
import { Link } from "@tanstack/react-router";
import { ArrowRight, RotateCcw, Brain, Sparkles } from "lucide-react";

const QUESTIONS = [
  {
    id: "goal",
    question: "What's your main goal?",
    options: [
      { label: "Switch to a career in AI/Data", value: "career" },
      { label: "Use AI to improve my current job", value: "upskill" },
      { label: "Build AI-powered products", value: "build" },
      { label: "Academic / research purposes", value: "research" },
    ],
  },
  {
    id: "background",
    question: "What's your technical background?",
    options: [
      { label: "No coding experience", value: "none" },
      { label: "Basic coding (some Python/Excel)", value: "basic" },
      { label: "Comfortable with programming", value: "mid" },
      { label: "Experienced developer / data professional", value: "advanced" },
    ],
  },
  {
    id: "time",
    question: "How much time can you dedicate weekly?",
    options: [
      { label: "1–3 hours", value: "low" },
      { label: "4–8 hours", value: "medium" },
      { label: "8+ hours", value: "high" },
    ],
  },
  {
    id: "interest",
    question: "Which topic excites you most?",
    options: [
      { label: "Machine Learning & prediction", value: "ml" },
      { label: "Language models & prompting", value: "llm" },
      { label: "Computer vision & images", value: "cv" },
      { label: "Data analysis & business insight", value: "data" },
    ],
  },
];

type Answers = Record<string, string>;

function getRecommendedLevel(answers: Answers): "Beginner" | "Intermediate" | "Advanced" {
  const bg = answers.background;
  if (bg === "none" || bg === "basic") return "Beginner";
  if (bg === "advanced") return "Advanced";
  return "Intermediate";
}

function getRecommendedTags(answers: Answers): string[] {
  const tags: string[] = [];
  const interest = answers.interest;
  if (interest === "llm") tags.push("prompt", "llm", "gpt", "language");
  if (interest === "ml") tags.push("machine learning", "ml", "sklearn", "python");
  if (interest === "cv") tags.push("vision", "image", "deep learning", "neural");
  if (interest === "data") tags.push("data", "analysis", "pandas", "business");
  if (answers.goal === "build") tags.push("python", "api", "deploy");
  return tags;
}

export function LearningPathQuiz() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const { data: courses = [] } = useCourses();
  const { lang } = useLanguage();

  const question = QUESTIONS[step];

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
    setStarted(false);
  };

  const getRecommendations = () => {
    const level = getRecommendedLevel(answers);
    const tags = getRecommendedTags(answers);
    const sameLevelCourses = courses.filter((c) => c.level === level);
    if (sameLevelCourses.length === 0) return courses.slice(0, 3);
    // Score by tag match
    const scored = sameLevelCourses.map((c) => {
      const title = (
        getLocalizedField(c, "title", lang) +
        " " +
        (getLocalizedField(c, "description", lang) ?? "")
      ).toLowerCase();
      const score = tags.filter((t) => title.includes(t)).length;
      return { course: c, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map((s) => s.course);
  };

  if (!started) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-accent">
              <Brain className="h-7 w-7" />
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold md:text-4xl">
              Find your learning path
            </h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              4 quick questions. Get a personalized course recommendation based on your goals and
              background.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-medium text-primary-foreground transition hover:scale-[1.03] glow-shadow"
            >
              <Sparkles className="h-4 w-4" /> Start the quiz
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {!done ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-border bg-card p-8"
            >
              {/* Progress */}
              <div className="mb-6 flex items-center gap-3">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
              <div className="font-mono text-xs text-muted-foreground">
                Question {step + 1} of {QUESTIONS.length}
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold">{question.question}</h3>
              <div className="mt-6 grid gap-3">
                {question.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className="group flex items-center justify-between rounded-xl border border-border bg-background px-5 py-4 text-left text-sm transition hover:border-primary hover:bg-primary/5"
                  >
                    <span>{opt.label}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-primary" />
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-border bg-card p-8"
          >
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold">Your recommended courses</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Based on your {getRecommendedLevel(answers).toLowerCase()} level and interests
              </p>
            </div>

            <div className="mt-8 grid gap-4">
              {getRecommendations().map((course, i) => (
                <Link
                  key={course.id}
                  to="/courses/$slug"
                  params={{ slug: course.slug }}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-background px-5 py-4 transition hover:border-primary/50"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-sm font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium leading-snug">
                      {getLocalizedField(course, "title", lang)}
                    </div>
                    {course.duration && (
                      <div className="mt-0.5 text-xs text-muted-foreground">{course.duration}</div>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
              ))}

              {getRecommendations().length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-4">
                  No courses match yet — check back as new programs are added.
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:scale-[1.03]"
              >
                Browse all courses <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground transition hover:border-accent hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Retake quiz
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
