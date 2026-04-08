'use client';

import { Matrix } from '@/lib/types';
import { motion } from 'motion/react';

interface MatrixCardProps {
  matrix: Matrix;
  isSelected: boolean;
  onClick: () => void;
}

export function MatrixCard({ matrix, isSelected, onClick }: MatrixCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left glass rounded-3xl p-5 transition-all duration-300 ${isSelected ? 'ring-2 ring-[var(--color-dark-accent)] shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
    >
      <h3 className="font-bold text-lg mb-4 accent-text">{matrix.theme}</h3>
      <div className="space-y-3">
        {matrix.dimensions.map((dim, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs opacity-80">
              <span>{dim.label}</span>
              <span>{dim.intensity}/5</span>
            </div>
            <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(dim.intensity / 5) * 100}%` }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="h-full accent-bg rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.button>
  );
}
