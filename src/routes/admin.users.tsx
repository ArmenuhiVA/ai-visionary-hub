import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Eye, EyeOff, Trash2, UserPlus } from "lucide-react";
import { listUsers, createUser, deleteUser, updateUserRole } from "@/lib/admin-users.functions";

export const Route = createFileRoute("/admin/users")({
  ssr: false,
  component: UsersPage,
});

type Row = { id: string; email: string; created_at: string; roles: string[] };

function UsersPage() {
  const list = useServerFn(listUsers);
  const create = useServerFn(createUser);
  const del = useServerFn(deleteUser);
  const upd = useServerFn(updateUserRole);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [role, setRole] = useState<"admin" | "viewer">("viewer");
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await list();
      setRows(data as Row[]);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await create({ data: { email, password, role } });
      toast.success("User created");
      setEmail("");
      setPassword("");
      setRole("viewer");
      refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to create user");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await del({ data: { userId: id } });
      toast.success("Deleted");
      refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    }
  };

  const onRoleChange = async (id: string, newRole: "admin" | "viewer") => {
    try {
      await upd({ data: { userId: id, role: newRole } });
      toast.success("Role updated");
      refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-display text-3xl font-bold">User Management</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Add admins or viewers. Viewers have read-only access.
      </p>

      <form
        onSubmit={onCreate}
        className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-6 sm:grid-cols-[1fr_1fr_auto_auto]"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <div className="relative">
          <input
            type={showPwd ? "text" : "password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6)"
            className="w-full rounded-lg border border-border bg-input px-3 py-2 pr-10 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Toggle password visibility"
          >
            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "admin" | "viewer")}
          className="rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
        <button
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" /> {busy ? "..." : "Add user"}
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  No users
                </td>
              </tr>
            )}
            {rows.map((u) => {
              const currentRole = (
                u.roles.includes("admin")
                  ? "admin"
                  : u.roles.includes("viewer")
                    ? "viewer"
                    : "viewer"
              ) as "admin" | "viewer";
              return (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={currentRole}
                      onChange={(e) => onRoleChange(u.id, e.target.value as "admin" | "viewer")}
                      className="rounded border border-border bg-input px-2 py-1 text-xs"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onDelete(u.id)}
                      className="text-destructive hover:opacity-80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
