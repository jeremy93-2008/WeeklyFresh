"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LogIn } from "lucide-react";

interface AuthButtonProps {
  variant?: "default" | "compact";
}

export function AuthButton(props: AuthButtonProps) {
  const { variant = "default" } = props;
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return <UserButton />;
  }

  if (variant === "compact") {
    return (
      <Link
        href="/sign-in"
        className="flex items-center justify-center rounded-full bg-primary p-2 text-primary-foreground hover:bg-primary/80 transition-colors"
        aria-label="Iniciar sesión"
      >
        <LogIn className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <Link
      href="/sign-in"
      className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
    >
      <LogIn className="h-4 w-4" />
      Iniciar sesión
    </Link>
  );
}
