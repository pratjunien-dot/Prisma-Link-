'use client';

import { useAppStore } from '@/lib/store';
import { Maximize, Minimize, Radio, Settings, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export function Header() {
  const { isFullscreen, toggleFullscreen, isRadioPlaying, toggleRadio, theme, setTheme } = useAppStore();
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  if (isFullscreen) return null;

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass rounded-b-3xl p-4 flex justify-between items-center sticky top-0 z-50"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full accent-bg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-black/20">
          P
        </div>
        <h1 className="font-bold text-xl tracking-tight">Prisma Link</h1>
      </div>

      <div className="flex items-center gap-2 relative">
        <button 
          onClick={() => setShowThemeSelector(!showThemeSelector)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <Palette size={20} />
        </button>

        <AnimatePresence>
          {showThemeSelector && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute top-full right-0 mt-2 glass rounded-2xl p-2 flex flex-col gap-2 min-w-[120px]"
            >
              <button onClick={() => { setTheme('dark'); setShowThemeSelector(false); }} className={`px-3 py-2 rounded-xl text-left text-sm ${theme === 'dark' ? 'accent-bg' : 'hover:bg-black/10 dark:hover:bg-white/10'}`}>Dark Mode</button>
              <button onClick={() => { setTheme('light'); setShowThemeSelector(false); }} className={`px-3 py-2 rounded-xl text-left text-sm ${theme === 'light' ? 'accent-bg' : 'hover:bg-black/10 dark:hover:bg-white/10'}`}>Light Mode</button>
              <button onClick={() => { setTheme('cyberpunk'); setShowThemeSelector(false); }} className={`px-3 py-2 rounded-xl text-left text-sm ${theme === 'cyberpunk' ? 'accent-bg' : 'hover:bg-black/10 dark:hover:bg-white/10'}`}>Cyberpunk Mode</button>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={toggleRadio}
          className={`p-2 rounded-full transition-colors ${isRadioPlaying ? 'accent-text bg-white/10 animate-pulse' : 'hover:bg-white/10'}`}
        >
          <Radio size={20} />
        </button>
        <button 
          onClick={toggleFullscreen}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <Maximize size={20} />
        </button>
      </div>
    </motion.header>
  );
}
