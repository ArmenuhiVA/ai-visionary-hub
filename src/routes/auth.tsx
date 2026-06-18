import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Brain } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Admin" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/admin" });
  }, [session, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const fn =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    const { error } = await fn;
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success(mode === "signin" ? "Welcome back" : "Account created — check your email");
      if (mode === "signin") navigate({ to: "/admin" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gradient px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 glow-shadow">
        <div className="flex items-center gap-2 text-brand-gradient">
          <Brain className="h-6 w-6" />
          <span className="font-display text-lg font-bold">Admin</span>
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <p className="mt-1 text-xs text-muted-foreground">The first account created becomes admin.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary" />
          <button disabled={busy} className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
            {busy ? "..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-foreground">← Back to site</Link>
      </div>
    </div>
  );
}
