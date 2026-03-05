
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Shield, Clock, ArrowRightLeft, Loader2, Battery, Wallet, LayoutDashboard } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  pack: Product;
  onCompare: (pack: Product) => void;
  onOrder: (pack: Product) => void;
  isComparing: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ pack, onCompare, onOrder, isComparing }) => {
  const isBestSeller = pack.isBestSeller;
  const [isPending, setIsPending] = useState(false);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPending) return;

    setIsPending(true);
    if (window.navigator.vibrate) window.navigator.vibrate(10);
    
    setTimeout(() => {
      onCompare(pack);
      setIsPending(false);
    }, 600);
  };
  
  return (
    <div className={`product-card group relative flex flex-col h-full p-6 md:p-8 rounded-[40px] transition-all duration-700 border-2 ${
      isBestSeller 
        ? 'bg-slate-900 dark:bg-slate-950 text-white border-transparent shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] scale-105 z-10 hover:scale-[1.07]' 
        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2'
    } ${
      isComparing 
        ? 'ring-4 ring-blue-500/30 border-blue-500 dark:border-blue-400 shadow-[0_0_50px_rgba(59,130,246,0.4)] z-40 scale-[1.05] -translate-y-4' 
        : ''
    }`}>
      {isBestSeller && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand-orange text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl z-20 group-hover:scale-110 group-hover:-rotate-2 transition-all duration-500 whitespace-nowrap">
          Best Seller UEMOA
        </div>
      )}

      {/* Blue Luminous Overlay for Comparison */}
      {isComparing && (
        <div className="absolute inset-0 rounded-[40px] border-4 border-blue-500/50 pointer-events-none opacity-100 animate-pulse z-50">
          <div className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
        </div>
      )}
      
      <div className="mb-6 md:mb-8">
        <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-4 transition-colors duration-300 ${
            isBestSeller ? 'text-brand-yellow' : 'text-emerald-600 dark:text-emerald-400'
        }`}>
          Gamme PAYG {pack.gamme}
        </p>
        <h3 className={`text-2xl md:text-3xl font-black mb-4 tracking-tighter transition-transform group-hover:translate-x-1 duration-500 origin-left ${
            isBestSeller ? 'text-white' : 'text-slate-900 dark:text-white'
        }`}>
            {pack.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl md:text-4xl font-black tracking-tighter ${isBestSeller ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
            {pack.monthly.toLocaleString()}
          </span>
          <span className={`font-black text-[10px] md:text-xs uppercase opacity-40 ${isBestSeller ? 'text-white' : 'text-slate-900 dark:text-slate-400'}`}>
            F CFA <span className="text-[9px] md:text-[10px] lowercase opacity-60 font-medium">(Mensualité x{pack.mensualites_nb})</span>
          </span>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3 md:gap-4">
            <div className={`p-4 rounded-2xl ${isBestSeller ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-100 dark:bg-slate-700/50'}`}>
                <p className="text-[9px] font-black uppercase opacity-50 mb-1">Acompte</p>
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{pack.acompte.toLocaleString()} F</p>
            </div>
            <div className={`p-4 rounded-2xl ${isBestSeller ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-100 dark:bg-slate-700/50'}`}>
                <p className="text-[9px] font-black uppercase mb-1 text-brand-orange">{pack.price.toLocaleString()} F CFA</p>
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">Prix Total</p>
            </div>
        </div>
      </div>

      <div className="space-y-5 mb-10 flex-grow">
        {[
          { icon: <Clock className="w-4 h-4" />, label: `Autonomie: ${pack.autonomy}` },
          { icon: <LayoutDashboard className="w-4 h-4" />, label: `Surface: ${pack.surface}` },
          { icon: <Battery className="w-4 h-4" />, label: `Capacité Lithium: ${pack.capacity_kwh} kWh` }
        ].map((feat, i) => (
          <div key={i} className="flex items-center gap-4 transition-transform group-hover:translate-x-1 duration-500" style={{ transitionDelay: `${i * 100}ms` }}>
            <div className={`p-2.5 rounded-xl ${isBestSeller ? 'bg-white/10' : 'bg-slate-100 dark:bg-slate-700'} group-hover:scale-110 transition-transform`}>
              {React.cloneElement(feat.icon as React.ReactElement, { className: `w-4 h-4 ${isBestSeller ? 'text-brand-yellow' : 'text-emerald-600 dark:text-emerald-400'}` })}
            </div>
            <span className={`font-bold text-xs uppercase tracking-wide ${isBestSeller ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
              {feat.label}
            </span>
          </div>
        ))}

        <div className="space-y-4 mt-4">
          <p className={`text-[10px] font-black uppercase tracking-widest ${isBestSeller ? 'text-white/60' : 'text-slate-400'}`}>Garantie jusqu'à 10 ans</p>
          <div className="space-y-3">
            {[
              { label: 'Panneaux', years: 10, color: 'bg-emerald-500', width: '100%' },
              { label: 'Batteries', years: 7, color: 'bg-emerald-400', width: '70%' },
              { label: 'Onduleur', years: 2, color: 'bg-emerald-300', width: '20%' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[8px] font-black uppercase tracking-tighter">
                  <span className={isBestSeller ? 'text-white/80' : 'text-slate-600'}>{item.label}</span>
                  <span className={isBestSeller ? 'text-brand-yellow' : 'text-emerald-600'}>{item.years} ans</span>
                </div>
                <div className={`h-1.5 w-full rounded-full ${isBestSeller ? 'bg-white/10' : 'bg-slate-100'}`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: item.width }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        <button 
          onClick={() => onOrder(pack)}
          className={`block w-full py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.25em] transition-all duration-500 hover:-translate-y-1.5 active:scale-[0.97] shadow-2xl ${
            isBestSeller 
              ? 'bg-white text-slate-900 hover:bg-brand-yellow shadow-white/5' 
              : 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-emerald-600 dark:hover:bg-emerald-500 shadow-slate-900/10'
          }`}
        >
          Réserver mon pack
        </button>
        
        <button 
          onClick={handleCompareClick}
          disabled={isPending}
          className={`group/btn flex items-center justify-center gap-3 py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 rounded-[22px] border-2 ${
            isComparing 
              ? 'bg-blue-500 text-white border-transparent shadow-xl shadow-blue-500/20' 
              : isBestSeller 
                ? 'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-blue-500' 
                : 'bg-transparent text-slate-400 border-slate-100 dark:border-slate-700 hover:border-blue-500/50 hover:text-blue-600'
          }`}
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}
          {isComparing ? 'Sélectionné' : 'Comparer'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
