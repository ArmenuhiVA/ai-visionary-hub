import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Mail } from "lucide-react";

export const Route = createFileRoute("/admin/messages")({
  component: Messages,
});

type Msg = {
  id: string; name: string; email: string; subject: string | null; message: string;
  is_read: boolean | null; created_at: string;
};

function Messages() {
  const qc = useQueryClient();
  const { data: messages = [] } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      return (data ?? []) as Msg[];
    },
  });
  const [open, setOpen] = useState<string | null>(null);

  const markRead = useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
      await supabase.from("contact_messages").update({ is_read: read }).eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("contact_messages").delete().eq("id", id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
      toast.success("Deleted");
    },
  });

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-bold">Messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">{messages.filter((m) => !m.is_read).length} unread</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs text-muted-foreground">
            <tr>
              <th className="w-1 px-4 py-3"></th>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => (
              <>
                <tr key={m.id} onClick={() => { setOpen(open === m.id ? null : m.id); if (!m.is_read) markRead.mutate({ id: m.id, read: true }); }} className="cursor-pointer border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3">{!m.is_read && <span className="block h-2 w-2 rounded-full bg-accent" />}</td>
                  <td className="px-4 py-3"><div className="font-medium">{m.name}</div><div className="text-xs text-muted-foreground">{m.email}</div></td>
                  <td className="px-4 py-3">{m.subject || <span className="text-muted-foreground">(no subject)</span>}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <a href={`mailto:${m.email}`} onClick={(e) => e.stopPropagation()} className="rounded-md p-1.5 hover:bg-muted"><Mail className="h-3.5 w-3.5" /></a>
                    <button onClick={(e) => { e.stopPropagation(); if (confirm("Delete?")) del.mutate(m.id); }} className="rounded-md p-1.5 text-destructive hover:bg-muted"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
                {open === m.id && (
                  <tr key={`${m.id}-body`} className="border-t border-border bg-muted/20">
                    <td colSpan={5} className="px-4 py-4 text-sm whitespace-pre-wrap">{m.message}</td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {messages.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No messages yet.</div>}
      </div>
    </div>
  );
}
