import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, MessageSquare, Mic, User } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  component: Dashboard,
});

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [c, t, m, mUnread] = await Promise.all([
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("talks").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
      ]);
      return {
        courses: c.count ?? 0,
        talks: t.count ?? 0,
        messages: m.count ?? 0,
        unread: mUnread.count ?? 0,
      };
    },
  });

  const cards = [
    { label: "Courses", value: data?.courses ?? 0, icon: BookOpen, to: "/admin/courses" },
    { label: "Talks", value: data?.talks ?? 0, icon: Mic, to: "/admin/talks" },
    { label: "Messages", value: data?.messages ?? 0, badge: data?.unread, icon: MessageSquare, to: "/admin/messages" },
    { label: "Profile", value: "Edit", icon: User, to: "/admin/profile" },
  ];

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of your site content.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="group relative rounded-xl border border-border bg-card p-5 transition hover:border-primary/50"
          >
            <c.icon className="h-5 w-5 text-accent" />
            <div className="mt-3 font-display text-3xl font-bold">{c.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{c.label}</div>
            {c.badge !== undefined && c.badge > 0 && (
              <span className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{c.badge}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
