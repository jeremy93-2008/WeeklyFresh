import { MobileNav } from "./mobile-nav";
import { MobileHeader } from "./mobile-header";
import { DesktopSidebar } from "./desktop-sidebar";

export function NavWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DesktopSidebar />
      <MobileHeader />
      <main className="flex-1 pb-16 md:pb-0 md:pl-60">{children}</main>
      <MobileNav />
    </>
  );
}
