'use client';

import { Persona } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

interface PersonaCardProps {
  persona: Persona;
  isSelected?: boolean;
  onClick?: () => void;
  showFavoriteBtn?: boolean;
}

export function PersonaCard({ persona, isSelected, onClick, showFavoriteBtn = true }: PersonaCardProps) {
  const { favoritePersonas, addFavoritePersona, removeFavoritePersona } = useAppStore();
  const isFavorite = favoritePersonas.some(p => p.id === persona.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavoritePersona(persona.id);
    } else {
      addFavoritePersona(persona);
    }
  };

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`relative w-full text-left glass rounded-3xl p-5 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${isSelected ? 'ring-2 ring-[var(--color-dark-accent)] shadow-[0_0_30px_rgba(139,92,246,0.4)]' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
    >
      {showFavoriteBtn && (
        <button 
          onClick={toggleFavorite}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <Star size={20} className={isFavorite ? 'fill-yellow-400 text-yellow-400' : 'opacity-50'} />
        </button>
      )}
      
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 rounded-full accent-bg flex items-center justify-center text-white font-bold text-xl shadow-inner">
          {persona.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight">{persona.name}</h3>
          {persona.matrix && <p className="text-xs opacity-60">{persona.matrix.theme}</p>}
        </div>
      </div>
      
      <p className="text-sm opacity-80 mb-3 italic">&quot;{persona.catchphrase}&quot;</p>
      <p className="text-sm text-balance">{persona.description}</p>
    </motion.div>
  );
}
