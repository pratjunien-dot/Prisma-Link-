"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NoyauFractal } from "./NoyauFractal";
import { THEMES } from "@/lib/themes";
import { useThemeStore } from "@/stores/theme.store";

export function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [isDone, setIsDone] = useState(false);
  const themeKey = useThemeStore((s) => s.theme);
  const theme = THEMES[themeKey];

  const handleDone = () => {
    setIsDone(true);
    setTimeout(onComplete, 800); // Wait for fade out
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#04070F]"
        >
          <div className="w-64 h-64 relative">
            <NoyauFractal accent={theme.accent} onDone={handleDone} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <h1 className="text-2xl tracking-[0.2em] font-light text-white mb-2" style={{ fontFamily: "var(--font-family-display)" }}>PRISMA</h1>
            <p className="text-xs tracking-widest text-white/40" style={{ fontFamily: "var(--font-family-mono)" }}>LIQUID GLASS OS</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
