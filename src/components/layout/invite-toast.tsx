"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface InviteToastProps {
  count: number;
}

export function InviteToast(props: InviteToastProps) {
  const { count } = props;
  useEffect(() => {
    if (count > 0) {
      toast.success(
        count === 1
          ? "¡Te han invitado a un plan semanal!"
          : `¡Te han invitado a ${count} planes semanales!`,
        { duration: 5000 }
      );
    }
  }, [count]);

  return null;
}
