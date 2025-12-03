
import * as React from 'react';
import type { Product, Page } from '../types';

interface CompareBarProps {
  compareList: Product[];
  onNavigate: (page: Page) => void;
  onClear: () => void;
  onRemove: (productId: string) => void;
}

export const CompareBar: React.FC<CompareBarProps> = ({ compareList, onNavigate, onClear, onRemove }) => {
  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)] z-40 animate-slide-up">
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            <h3 className="font-bold text-sm sm:text-lg text-light-text dark:text-dark-text hidden sm:block">Compare Items ({compareList.length}/4)</h3>
            <div className="flex items-center gap-2">
              {compareList.map(p => (
                <div key={p.id} className="relative group">
                  <img src={p.images[0]} alt={p.name} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md border-2 border-primary-gold" />
                  <button onClick={() => onRemove(p.id)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* @ts-ignore */}
                    <ion-icon name="close-outline"></ion-icon>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => onNavigate('compare')}
              className="px-3 sm:px-6 py-2 bg-primary-gold text-white font-bold rounded-md hover:bg-dark-gold transition-colors text-sm sm:text-base"
            >
              Compare
            </button>
            <button onClick={onClear} className="px-3 sm:px-6 py-2 bg-gray-300 dark:bg-gray-700 text-light-text dark:text-dark-text font-bold rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base">
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};