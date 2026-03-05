
import React from 'react';
import { X, ArrowRightLeft, Trash2, Zap } from 'lucide-react';
import { Product } from '../types';

interface ComparisonBarProps {
  items: Product[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpenComparison: () => void;
}

const ComparisonBar: React.FC<ComparisonBarProps> = ({ items, onRemove, onClear, onOpenComparison }) => {
  if (items.length === 0) return null;

  const canCompare = items.length >= 2;

  return (
    <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-[80] w-[95%] max-w-5xl animate-in slide-in-from-bottom-12 duration-700">
      <div className="bg-slate-900/95 dark:bg-white/95 backdrop-blur-2xl border border-white/10 dark:border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] rounded-2xl md:rounded-[32px] p-1 md:p-2 flex flex-col md:flex-row items-center gap-1 md:gap-2">
        
        <div className="flex-1 flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar w-full p-2">
          <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 bg-white/10 dark:bg-slate-100 rounded-xl md:rounded-2xl shrink-0">
            <div className="relative">
              <ArrowRightLeft className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 dark:text-emerald-600" />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-emerald-500 text-white text-[8px] font-black flex items-center justify-center rounded-full">
                  {items.length}
                </span>
              )}
            </div>
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white dark:text-slate-900">Duel</span>
          </div>
          
          <div className="flex gap-2 items-center">
            {items.map((item, idx) => (
              <React.Fragment key={item.id}>
                {idx > 0 && <span className="text-white/20 dark:text-slate-300 font-black text-[10px]">VS</span>}
                <div className="group relative flex items-center gap-2 bg-white/5 dark:bg-slate-50 border border-white/10 dark:border-slate-200 pl-3 pr-1 py-1 rounded-xl animate-in zoom-in-90 duration-300 shrink-0 hover:bg-white/10 dark:hover:bg-white transition-all">
                  <span className="text-[10px] md:text-xs font-bold text-white dark:text-slate-900 whitespace-nowrap">{item.name}</span>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="p-1 hover:bg-red-500/20 hover:text-red-400 text-white/40 dark:text-slate-400 rounded-lg transition-all"
                  >
                    <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 w-full md:w-auto p-1 md:p-2 border-t md:border-t-0 border-white/10 dark:border-slate-100">
          <button 
            onClick={onClear}
            className="flex-1 md:flex-none px-4 py-3 text-white/40 dark:text-slate-400 hover:text-red-400 dark:hover:text-red-500 font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Vider
          </button>
          
          <button 
            onClick={onOpenComparison}
            disabled={!canCompare}
            className={`relative flex-[2] md:flex-none px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 md:gap-3 group overflow-hidden ${
              canCompare 
                ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:bg-emerald-500 active:scale-95 ring-2 ring-emerald-400/20' 
                : 'bg-white/5 dark:bg-slate-100 text-white/20 dark:text-slate-300 cursor-not-allowed'
            }`}
          >
            {canCompare && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}
            {canCompare ? 'Comparer les packs' : `${items.length}/2 sélectionnés`}
            <ArrowRightLeft className={`w-3.5 h-3.5 ${canCompare ? 'animate-bounce' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;
