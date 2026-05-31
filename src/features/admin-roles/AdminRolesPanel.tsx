/**
 * AdminRolesPanel — لوحة إسناد الأدوار (Owner-only via RLS).
 * يستخدم RolesService لقراءة/إسناد/سحب الأدوار من user_roles.
 */
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RolesService } from "@/services/central";
import type { AppRole } from "@/services/central/roles.service";
import { AppCardSurface } from "@/components/shared/surfaces/AppCardSurface";
import { BaseBadge } from "@/components/ui/BaseBadge";
import { Loader2, Crown, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ROLE_OPTIONS: AppRole[] = [
  "owner", "ciso", "dpo", "infra_admin", "finance_admin",
  "department_manager", "project_manager", "team_member", "guest",
];

export const AdminRolesPanel: React.FC = () => {
  const qc = useQueryClient();
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["admin", "users-roles"],
    queryFn: RolesService.listAllUsersWithRoles,
  });
  const [pendingRole, setPendingRole] = useState<Record<string, AppRole>>({});

  const assign = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: AppRole }) =>
      RolesService.assignRole(userId, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users-roles"] }),
  });
  const revoke = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: AppRole }) =>
      RolesService.revokeRole(userId, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users-roles"] }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 text-sm text-red-600">
        تعذّر التحميل — هذه اللوحة متاحة لمالك النظام (Owner) فقط.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      <header className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center border border-border">
          <Crown className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">إدارة الأدوار</h2>
          <p className="text-sm text-muted-foreground">
            إسناد/سحب الأدوار للمستخدمين · {users.length} مستخدم
          </p>
        </div>
      </header>

      <AppCardSurface className="divide-y divide-border">
        {users.map((u) => (
          <div key={u.user_id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium">{u.display_name ?? u.user_id.slice(0, 8)}</div>
              <div className="text-xs text-muted-foreground font-mono">{u.user_id}</div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {u.roles.length === 0 ? (
                <span className="text-xs text-muted-foreground">بلا أدوار</span>
              ) : u.roles.map((r) => (
                <BaseBadge key={r} variant="secondary" className="flex items-center gap-1">
                  {r}
                  <button
                    onClick={() => revoke.mutate({ userId: u.user_id, role: r })}
                    className="hover:text-red-600"
                  ><Trash2 className="w-3 h-3" /></button>
                </BaseBadge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={pendingRole[u.user_id] ?? ""}
                onValueChange={(v) => setPendingRole((p) => ({ ...p, [u.user_id]: v as AppRole }))}
              >
                <SelectTrigger className="w-40"><SelectValue placeholder="إسناد دور" /></SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              <button
                onClick={() => {
                  const r = pendingRole[u.user_id];
                  if (!r) return;
                  assign.mutate({ userId: u.user_id, role: r });
                  setPendingRole((p) => ({ ...p, [u.user_id]: "" as AppRole }));
                }}
                disabled={!pendingRole[u.user_id] || assign.isPending}
                className="flex items-center gap-1 bg-foreground text-background px-3 py-2 rounded-full text-xs disabled:opacity-50"
              >
                <Plus className="w-3 h-3" />
                إسناد
              </button>
            </div>
          </div>
        ))}
      </AppCardSurface>
    </div>
  );
};
