import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, User, BookOpen, Mic, MessageSquare, LogOut, ExternalLink, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/profile", label: "Profile", icon: User },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/talks", label: "Talks", icon: Mic },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
];

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
        <div>
          <h1 className="font-display text-2xl">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">This account is not an admin.</p>
          <button onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/auth" }))} className="mt-4 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface/40 md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <Brain className="h-5 w-5 text-accent" />
          <span className="font-display font-bold text-brand-gradient">Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                  active ? "border-l-2 border-primary bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <div className="px-2 py-2 text-xs">
            <div className="truncate text-muted-foreground">{user.email}</div>
          </div>
          <Link to="/" className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-muted-foreground hover:bg-muted">
            <ExternalLink className="h-3.5 w-3.5" /> View site
          </Link>
          <button
            onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/auth" }))}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
