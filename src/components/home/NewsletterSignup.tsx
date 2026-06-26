import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    // Store as a contact message with a special subject so it's visible in admin
    const { error } = await supabase.from("contact_messages").insert({
      name: "Newsletter signup",
      email: email.trim(),
      subject: "Newsletter subscription",
      message: `New newsletter subscriber: ${email.trim()}`,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      setDone(true);
      toast.success("You're subscribed! Watch for new courses and talks.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-7xl px-4 py-16"
    >
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-12 text-center md:px-16">
        {/* Background glow */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 font-mono text-xs text-accent">
            <Sparkles className="h-3 w-3" /> Stay in the loop
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
            New courses. Upcoming talks. AI insights.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Get notified when Dr. Varazdat launches a new program or speaks at an event near you.
          </p>

          {done ? (
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-6 py-3 text-accent">
              <Mail className="h-4 w-4" /> You're on the list — thank you!
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <div className="relative w-full max-w-sm">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border border-border bg-input py-3 pl-11 pr-4 text-sm outline-none focus:border-primary transition"
                />
              </div>
              <button
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.03] disabled:opacity-60 glow-shadow whitespace-nowrap"
              >
                {submitting ? "Subscribing…" : "Notify me"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
          <p className="mt-4 text-xs text-muted-foreground/60">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
