"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { AuthButton } from "./auth-button";

interface NavItemsProps {
  pathname: string;
  layout: "sidebar" | "bar";
}

function NavItems(props: NavItemsProps) {
  const { pathname, layout } = props;
  return (
    <>
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center transition-colors",
              layout === "bar"
                ? cn(
                    "flex-col gap-0.5 text-xs",
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  )
                : cn(
                    "gap-3 rounded-md px-3 py-2 text-sm",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell(props: AppShellProps) {
  const { children } = props;
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 inset-y-0 z-50 hidden w-60 flex-col border-r bg-card md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 p-3">
          <NavItems pathname={pathname} layout="sidebar" />
        </nav>
        <div className="flex items-center justify-between border-t p-3">
          <AuthButton />
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-card px-4 md:hidden">
        <Logo />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <AuthButton variant="compact" />
        </div>
      </header>

      <main className="flex-1 pb-16 md:pb-0 md:pl-60">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 border-t bg-card md:hidden safe-area-bottom">
        <div className="flex h-14 items-center justify-around">
          <NavItems pathname={pathname} layout="bar" />
        </div>
      </nav>
    </>
  );
}
