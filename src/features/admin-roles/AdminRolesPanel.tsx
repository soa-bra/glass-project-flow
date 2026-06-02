/**
 * AdminRolesPanel — Owner-only user management with glass modal create/edit.
 * Lists users via manage-users edge function. Supports create/edit/delete + role.
 */
import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BaseActionButton } from "@/components/shared/BaseActionButton";
import { BaseBadge } from "@/components/ui/BaseBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Eye, Pencil, Trash2, UserPlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

type AppRole =
  | "owner" | "ciso" | "dpo" | "infra_admin" | "finance_admin"
  | "department_manager" | "project_manager" | "team_member" | "guest";

interface ManagedUser {
  user_id: string;
  email: string;
  display_name: string | null;
  last_sign_in_at: string | null;
  roles: AppRole[];
}

const ROLE_OPTIONS: AppRole[] = [
  "owner", "ciso", "dpo", "infra_admin", "finance_admin",
  "department_manager", "project_manager", "team_member", "guest",
];

const ROLE_LABEL: Record<AppRole, string> = {
  owner: "Owner",
  ciso: "CISO",
  dpo: "DPO",
  infra_admin: "Infra Admin",
  finance_admin: "Finance Admin",
  department_manager: "Department Manager",
  project_manager: "Project Manager",
  team_member: "Team Member",
  guest: "Guest",
};

const ROLE_DESCRIPTION: Record<AppRole, string> = {
  owner: "وصول كامل للنظام — تجاوز الموافقات",
  ciso: "سياسات الأمن والحوادث وتدوير المفاتيح",
  dpo: "الخصوصية والامتثال وطلبات المحو",
  infra_admin: "البنية التحتية والنشر والسجلات",
  finance_admin: "الحسابات والميزانيات والتقارير",
  department_manager: "إدارة قسم ومهامه وميزانيته",
  project_manager: "إدارة مشروع ومهامه ونفقاته",
  team_member: "تنفيذ المهام المسندة وتسجيل الأوقات",
  guest: "وصول مؤقت محدود لمرفقات مشروع",
};

async function invokeManageUsers<T = unknown>(payload: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("manage-users", { body: payload });
  if (error) throw error;
  if (!data?.ok) throw new Error(data?.error ?? "operation_failed");
  return data as T;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const AdminRolesPanel: React.FC = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [modalState, setModalState] = useState<
    | { mode: "closed" }
    | { mode: "create" }
    | { mode: "edit"; user: ManagedUser }
    | { mode: "view"; user: ManagedUser }
  >({ mode: "closed" });

  useEffect(() => {
    if (!user) { setIsOwner(false); return; }
    supabase
      .rpc("has_role", { _user_id: user.id, _role: "owner" })
      .then(({ data }) => setIsOwner(Boolean(data)));
  }, [user]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "manage-users"],
    queryFn: () => invokeManageUsers<{ ok: true; users: ManagedUser[] }>({ action: "list" }),
    enabled: isOwner === true,
  });
  const users = data?.users ?? [];

  const del = useMutation({
    mutationFn: (user_id: string) => invokeManageUsers({ action: "delete", user_id }),
    onSuccess: () => {
      toast.success("تم حذف المستخدم");
      qc.invalidateQueries({ queryKey: ["admin", "manage-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isOwner === null) {
    return <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }
  if (!isOwner) {
    return <div className="p-6 text-sm text-red-600">هذه اللوحة متاحة لمالك النظام (Owner) فقط.</div>;
  }

  return (
    <div dir="rtl" className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">إدارة المستخدمين</h2>
        <button
          onClick={() => setModalState({ mode: "create" })}
          className="flex items-center gap-2 bg-black text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-black/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          إضافة مستخدم جديد
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : error ? (
        <div className="p-6 text-sm text-red-600">تعذّر تحميل المستخدمين.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((u) => {
            const primaryRole = u.roles[0];
            return (
              <div
                key={u.user_id}
                className="bg-white border border-border rounded-[24px] p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-base text-foreground truncate">
                        {u.display_name ?? u.email.split("@")[0]}
                      </span>
                      <BaseBadge className="bg-emerald-100 text-emerald-700 border-emerald-200">نشط</BaseBadge>
                      {primaryRole && (
                        <BaseBadge className={primaryRole === "owner"
                          ? "bg-violet-100 text-violet-700 border-violet-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"}>
                          {ROLE_LABEL[primaryRole]}
                        </BaseBadge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{u.email}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      آخر دخول: {formatDate(u.last_sign_in_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* ACT-BTN-S03 — view */}
                  <BaseActionButton variant="view" size="sm" icon={Eye}
                    onClick={() => setModalState({ mode: "view", user: u })} />
                  {/* ACT-BTN-S03 — edit */}
                  <BaseActionButton variant="edit" size="sm" icon={Pencil}
                    onClick={() => setModalState({ mode: "edit", user: u })} />
                  {/* ACT-BTN-PSA03 — delete (sensitive) */}
                  <button
                    onClick={() => {
                      if (confirm(`حذف ${u.email}؟`)) del.mutate(u.user_id);
                    }}
                    disabled={del.isPending || u.user_id === user?.id}
                    className="w-8 h-8 rounded-full bg-transparent border border-red-500 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors disabled:opacity-40"
                    aria-label="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <UserFormModal
        state={modalState}
        onClose={() => setModalState({ mode: "closed" })}
        onSaved={() => qc.invalidateQueries({ queryKey: ["admin", "manage-users"] })}
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────

interface UserFormModalProps {
  state:
    | { mode: "closed" }
    | { mode: "create" }
    | { mode: "edit"; user: ManagedUser }
    | { mode: "view"; user: ManagedUser };
  onClose: () => void;
  onSaved: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ state, onClose, onSaved }) => {
  const isOpen = state.mode !== "closed";
  const isEdit = state.mode === "edit";
  const isView = state.mode === "view";
  const existing = state.mode === "edit" || state.mode === "view" ? state.user : null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<AppRole>("team_member");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setEmail(existing?.email ?? "");
    setDisplayName(existing?.display_name ?? "");
    setRole((existing?.roles[0] as AppRole) ?? "team_member");
    setPassword("");
  }, [isOpen, existing?.user_id]);

  const title = useMemo(() => {
    if (state.mode === "create") return "إضافة مستخدم جديد";
    if (state.mode === "edit") return "تعديل المستخدم";
    return "بيانات المستخدم";
  }, [state.mode]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (state.mode === "create") {
        if (!email || !password) { toast.error("البريد وكلمة المرور مطلوبان"); return; }
        await invokeManageUsers({
          action: "create", email, password, display_name: displayName, role,
        });
        toast.success("تم إنشاء المستخدم");
      } else if (state.mode === "edit") {
        await invokeManageUsers({
          action: "update",
          user_id: existing!.user_id,
          email: email !== existing!.email ? email : undefined,
          password: password || undefined,
          display_name: displayName,
          role,
        });
        toast.success("تم تحديث المستخدم");
      }
      onSaved();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sb-modal-shell max-w-lg p-0 border-0 shadow-none [&>button]:hidden"
        dir="rtl"
      >
        <div className="p-7">
          <DialogHeader className="flex flex-row items-center justify-between mb-6 space-y-0">
            <DialogTitle className="text-xl font-bold text-foreground">{title}</DialogTitle>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-black/40 flex items-center justify-center hover:bg-white/40 transition"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="display-name" className="text-sm font-medium mb-1.5 block">الاسم</Label>
              <Input id="display-name" value={displayName} disabled={isView}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-white/60 border-white/40" placeholder="اسم المستخدم" />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium mb-1.5 block">البريد الإلكتروني</Label>
              <Input id="email" type="email" value={email} disabled={isView}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/60 border-white/40" placeholder="user@example.com" dir="ltr" />
            </div>
            {!isView && (
              <div>
                <Label htmlFor="password" className="text-sm font-medium mb-1.5 block">
                  كلمة المرور {isEdit && <span className="text-xs text-muted-foreground">(اتركها فارغة لعدم التغيير)</span>}
                </Label>
                <Input id="password" type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/60 border-white/40" placeholder="••••••" dir="ltr" />
              </div>
            )}
            <div>
              <Label className="text-sm font-medium mb-1.5 block">الصلاحية (الدور)</Label>
              <Select value={role} onValueChange={(v) => setRole(v as AppRole)} disabled={isView}>
                <SelectTrigger className="bg-white/60 border-white/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!isView && (
            <DialogFooter className="mt-7 flex flex-row gap-3 sm:justify-start">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-black text-white rounded-full px-6 py-2.5 text-sm font-medium hover:bg-black/90 transition disabled:opacity-50"
              >
                {saving ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديلات" : "إنشاء المستخدم"}
              </button>
              <button
                onClick={onClose}
                className="bg-white/40 border border-black/20 text-black rounded-full px-6 py-2.5 text-sm font-medium hover:bg-white/60 transition"
              >
                إلغاء
              </button>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
