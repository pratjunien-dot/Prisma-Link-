"use client";
import { useState, useEffect } from "react";
import { useThemeStore } from "@/stores/theme.store";
import { THEMES } from "@/lib/themes";
import { BootScreen } from "@/components/boot/BootScreen";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const [isBooting, setIsBooting] = useState(true);
  const [mounted, setMounted] = useState(false);
  const themeKey = useThemeStore((s) => s.theme);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  const theme = THEMES[themeKey];

  return (
    <div 
      style={{
        backgroundColor: theme.bg,
        color: "white",
        minHeight: "100vh",
        transition: "background-color 0.5s ease",
        fontFamily: "var(--font-family-ui)"
      }}
      className="antialiased overflow-x-hidden"
    >
      {isBooting ? (
        <BootScreen onComplete={() => setIsBooting(false)} />
      ) : (
        children
      )}
    </div>
  );
}
