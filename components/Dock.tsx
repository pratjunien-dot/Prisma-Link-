'use client';

import { useAppStore } from '@/lib/store';
import { Home, Star, MessageSquare, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface DockProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export function Dock({ currentTab, setTab }: DockProps) {
  const { isFullscreen } = useAppStore();

  if (isFullscreen) return null;

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'favorites', icon: Star, label: 'Favoris' },
    { id: 'debate', icon: MessageSquare, label: 'Débat' },
  ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-4 left-4 right-4 glass rounded-3xl p-2 flex justify-around items-center z-50"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`relative p-3 rounded-2xl flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-white' : 'opacity-60 hover:opacity-100'}`}
          >
            {isActive && (
              <motion.div
                layoutId="dock-indicator"
                className="absolute inset-0 accent-bg rounded-2xl -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon size={24} className={isActive ? 'animate-bounce' : ''} style={{ animationDuration: '2s' }} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </motion.div>
  );
}
