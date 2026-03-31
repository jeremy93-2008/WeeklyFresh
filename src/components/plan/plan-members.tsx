"use client";

import { useState, useTransition } from "react";
import { Users, X, Mail, Eye, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { inviteMember, removeMember, updateMemberRole } from "@/actions/members";
import { toast } from "sonner";

interface Member {
  id: number;
  userId: string | null;
  email: string;
  role: string;
}

interface PlanMembersProps {
  planId: number;
  members: Member[];
  isOwner: boolean;
}

const ROLE_MAP: Record<string, { label: string; key: "viewer" | "editor" }> = {
  Ver: { label: "Ver", key: "viewer" },
  Editar: { label: "Editar", key: "editor" },
};

const KEY_TO_LABEL: Record<string, string> = {
  viewer: "Ver",
  editor: "Editar",
};

const ROLE_ICONS: Record<string, typeof Eye> = {
  viewer: Eye,
  editor: Pencil,
};

export function PlanMembers(props: PlanMembersProps) {
  const { planId, members, isOwner } = props;
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [roleLabel, setRoleLabel] = useState("Editar");
  const [isPending, startTransition] = useTransition();

  function handleInvite() {
    if (!email.trim()) return;
    const roleKey = ROLE_MAP[roleLabel]?.key ?? "editor";
    startTransition(async () => {
      try {
        await inviteMember(planId, email, roleKey);
        setEmail("");
        toast.success("Invitación enviada");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Error al invitar");
      }
    });
  }

  function handleRemove(memberId: number) {
    startTransition(async () => {
      try {
        await removeMember(planId, memberId);
        toast.success("Miembro eliminado");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Error");
      }
    });
  }

  function handleRoleChange(memberId: number, newLabel: string) {
    const roleKey = ROLE_MAP[newLabel]?.key;
    if (!roleKey) return;
    startTransition(async () => {
      try {
        await updateMemberRole(planId, memberId, roleKey);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Error");
      }
    });
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Users className="h-4 w-4" />
        Miembros
        {members.length > 0 && (
          <Badge variant="secondary" className="ml-1 text-xs">
            {members.length}
          </Badge>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Miembros del plan
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Member list */}
            {members.length > 0 ? (
              <div className="space-y-2">
                {members.map((member) => {
                  const RoleIcon = ROLE_ICONS[member.role] ?? Eye;
                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1 truncate">{member.email}</span>
                      {!member.userId && (
                        <Badge variant="secondary" className="text-xs">
                          Pendiente
                        </Badge>
                      )}
                      {isOwner ? (
                        <>
                          <Select
                            value={KEY_TO_LABEL[member.role] ?? "Ver"}
                            onValueChange={(v) =>
                              v && handleRoleChange(member.id, v)
                            }
                          >
                            <SelectTrigger className="w-[90px] h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ver">Ver</SelectItem>
                              <SelectItem value="Editar">Editar</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleRemove(member.id)}
                            disabled={isPending}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      ) : (
                        <Badge variant="outline" className="text-xs gap-1">
                          <RoleIcon className="h-3 w-3" />
                          {KEY_TO_LABEL[member.role] ?? member.role}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay miembros. Invita a alguien para compartir este plan.
              </p>
            )}

            {/* Invite form — only for owner */}
            {isOwner && (
              <div className="flex gap-2 pt-2 border-t">
                <Input
                  type="email"
                  placeholder="Email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  className="flex-1"
                />
                <Select
                  value={roleLabel}
                  onValueChange={(v) => v && setRoleLabel(v)}
                >
                  <SelectTrigger className="w-[90px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ver">Ver</SelectItem>
                    <SelectItem value="Editar">Editar</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleInvite}
                  disabled={isPending || !email.trim()}
                  size="sm"
                >
                  Invitar
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
