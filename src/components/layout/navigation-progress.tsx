"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const prevUrl = useRef("");

  useEffect(() => {
    const url = pathname + searchParams.toString();

    // First render — just store URL
    if (!prevUrl.current) {
      prevUrl.current = url;
      return;
    }

    // URL changed — navigation complete, fill to 100%
    if (prevUrl.current !== url) {
      prevUrl.current = url;
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }
  }, [pathname, searchParams]);

  // Listen for clicks on links and buttons to start progress
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a, button");
      if (!target) return;

      // Only for internal navigation links
      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (!href || href.startsWith("http") || href.startsWith("#")) return;
      }

      // Start progress bar
      setVisible(true);
      setProgress(15);

      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(intervalRef.current);
            return prev;
          }
          // Slow down as it gets higher
          const increment = prev < 50 ? 8 : prev < 80 ? 3 : 1;
          return Math.min(prev + increment, 90);
        });
      }, 200);

      // Safety timeout — hide after 10s if navigation didn't complete
      timeoutRef.current = setTimeout(() => {
        clearInterval(intervalRef.current);
        setProgress(100);
        setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 300);
      }, 10000);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1">
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress >= 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
