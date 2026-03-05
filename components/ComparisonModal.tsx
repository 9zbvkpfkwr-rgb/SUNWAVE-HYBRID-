import React, { useMemo } from 'react';
import { X, Check, Shield, Clock, Zap, Battery, ArrowRightLeft, TrendingDown, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { WHATSAPP_CONFIG } from '../constants';
import { db } from '../db';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, items }) => {
  const currentUser = db.getCurrentUser();
  const targetWhatsapp = useMemo(() => {
    const country = currentUser?.pays || "Côte d'Ivoire";
    if (country === 'Mali') return WHATSAPP_CONFIG.ML;
    if (country === 'Burkina Faso') return WHATSAPP_CONFIG.BF;
    if (country === 'Sénégal') return WHATSAPP_CONFIG.SN;
    if (country === 'Guinée') return WHATSAPP_CONFIG.GN;
    return WHATSAPP_CONFIG.CI;
  }, [currentUser]);

  const specs = [
    { label: 'Prix Total', key: 'price', format: (v: any) => `${v?.toLocaleString?.() || v} F CFA`, icon: <Star className="w-4 h-4" /> },
    { label: 'Mensualité (20x)', key: 'monthly', format: (v: any) => `${v?.toLocaleString?.() || v} F CFA`, icon: <TrendingDown className="w-4 h-4" /> },
    { label: 'Autonomie', key: 'autonomy', format: (v: any) => String(v), icon: <Clock className="w-4 h-4" /> },
    { label: 'Capacité', key: 'capacity_kwh', format: (v: any) => `${v} kWh`, icon: <Battery className="w-4 h-4" /> },
    { label: 'Garantie SAV', key: 'warranty', format: (v: any) => String(v), icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 sm:p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" 
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-slate-900 w-full max-w-6xl h-full sm:h-auto sm:max-h-[95vh] overflow-hidden sm:rounded-[4rem] shadow-[0_64px_128px_-24px_rgba(0,0,0,0.5)] flex flex-col border-none md:border md:border-slate-800"
          >
            
            {/* Header */}
            <div className="p-8 md:p-12 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-30">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
                  <ArrowRightLeft className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Duel Énergétique</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] mt-2">{items.length} Packs sélectionnés</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[2rem] transition-all border border-slate-100 dark:border-slate-700 group"
              >
                <X className="w-7 h-7 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-grow no-scrollbar pb-safe bg-slate-50/30 dark:bg-slate-900/30">
              <div className="min-w-full inline-flex md:grid md:grid-cols-[200px_repeat(auto-fit,minmax(280px,1fr))] lg:grid-cols-[240px_repeat(auto-fit,minmax(320px,1fr))] gap-0 md:gap-8 lg:gap-16 items-start p-6 md:p-12 lg:p-16 snap-x snap-mandatory">
                
                {/* Specs Column (Desktop) */}
                <div className="hidden md:block space-y-16 lg:space-y-24 pt-32 lg:pt-48 sticky left-0 z-20">
                  <div className="h-24 lg:h-32 flex items-center">
                     <span className="text-[10px] lg:text-[11px] font-black uppercase text-slate-400 tracking-[0.4em]">Spécifications</span>
                  </div>
                  {specs.map((spec, i) => (
                    <div key={i} className="h-24 lg:h-28 flex flex-col justify-center border-l-4 border-slate-100 dark:border-slate-800 pl-6 lg:pl-10 group">
                      <div className="flex items-center gap-3 lg:gap-4 mb-2 lg:mb-3 text-emerald-600 group-hover:scale-110 transition-transform origin-left">
                        {spec.icon}
                      </div>
                      <p className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-tight">{spec.label}</p>
                    </div>
                  ))}
                  <div className="h-24 lg:h-32 pt-8 lg:pt-10 border-l-4 border-slate-100 dark:border-slate-800 pl-6 lg:pl-10">
                     <span className="text-[10px] lg:text-[11px] font-black uppercase text-slate-400 tracking-[0.4em]">Matériel Inclus</span>
                  </div>
                </div>

                {/* Pack Columns */}
                {items.map((pack, pIdx) => (
                  <motion.div 
                    key={pack.id} 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: pIdx * 0.1 }}
                    className="min-w-full md:min-w-0 md:w-auto p-4 md:p-0 snap-center relative"
                  >
                    
                    {/* Pack Header Card */}
                    <div className={`p-8 lg:p-12 rounded-[3rem] lg:rounded-[4rem] mb-12 lg:mb-24 text-center border-2 transition-all duration-500 ${
                      pack.isBestSeller 
                        ? 'bg-slate-950 dark:bg-slate-950 text-white border-transparent shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] md:scale-105 relative z-10' 
                        : 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white shadow-sm'
                    }`}>
                      <p className={`text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] mb-4 lg:mb-5 ${pack.isBestSeller ? 'text-brand-orange' : 'text-emerald-600'}`}>
                        {pack.gamme}
                      </p>
                      <h4 className="text-[2rem] lg:text-[3rem] font-black mb-4 lg:mb-5 tracking-tighter leading-none uppercase">{pack.name}</h4>
                      {pack.isBestSeller && (
                        <div className="inline-flex items-center gap-2 lg:gap-3 px-4 lg:px-5 py-1.5 lg:py-2 bg-brand-orange text-white text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          Meilleur Choix
                        </div>
                      )}
                    </div>

                    {/* Values */}
                    <div className="space-y-12 lg:space-y-24">
                      {specs.map((spec, sIdx) => (
                        <div key={sIdx} className="h-auto md:h-24 lg:h-28 flex flex-col items-center justify-center text-center">
                          <div className="md:hidden flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4">
                             {spec.icon} {spec.label}
                          </div>
                          <p className={`text-2xl md:text-3xl lg:text-5xl font-black tracking-tighter ${
                            sIdx === 0 && pack.isBestSeller ? 'text-brand-orange' : 'text-slate-900 dark:text-white'
                          }`}>
                            {spec.format((pack as any)[spec.key])}
                          </p>
                        </div>
                      ))}

                      {/* Equipment List */}
                      <div className="space-y-6 lg:space-y-8">
                        <div className="md:hidden text-center text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Hardware Inclus</div>
                        <div className="flex flex-col gap-4 lg:gap-5 p-8 lg:p-12 bg-white dark:bg-slate-800/30 rounded-[2.5rem] lg:rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                          {pack.equipment.map((eq, eIdx) => (
                            <div key={eIdx} className="flex items-center gap-4 lg:gap-5 text-sm lg:text-base font-bold text-slate-600 dark:text-slate-300 group">
                              <div className="w-5 h-5 lg:w-6 lg:h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                <Check className="w-3 h-3 lg:w-4 lg:h-4" />
                              </div>
                              <span className="leading-tight tracking-tight">{eq}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="pt-6 lg:pt-8 pb-12 lg:pb-0">
                        <motion.a 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href={`${targetWhatsapp.link}?text=Bonjour, je souhaite commander le pack ${pack.name}.`}
                          className={`block w-full py-6 lg:py-8 rounded-[2rem] lg:rounded-[2.5rem] font-black text-[10px] lg:text-sm uppercase tracking-[0.3em] text-center transition-all duration-500 shadow-2xl active:scale-95 ${
                            pack.isBestSeller 
                              ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/30' 
                              : 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white'
                          }`}
                        >
                          Commander ce Pack
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Swipe Indicator */}
            <div className="md:hidden p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-center gap-3">
               {items.map((_, i) => (
                 <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === 0 ? 'bg-emerald-600 w-12' : 'bg-slate-300 dark:bg-slate-600 w-3'}`}></div>
               ))}
            </div>

            {/* AI Verdict */}
            {items.length >= 2 && (
              <motion.div 
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className="p-6 md:p-10 lg:p-16 bg-emerald-600 text-white relative overflow-hidden shrink-0"
              >
                <Zap className="absolute -right-16 -bottom-16 w-48 md:w-64 h-48 md:h-64 opacity-10 rotate-12" />
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 lg:gap-16 relative z-10">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-white/20 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center shrink-0 backdrop-blur-2xl border border-white/20 shadow-2xl">
                    <Zap className="w-8 h-8 md:w-12 md:h-12" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] mb-2 md:mb-4">Verdict de l'Assistant Sunwave</h4>
                    <p className="text-sm md:text-base lg:text-lg font-medium opacity-90 leading-relaxed max-w-4xl">
                      {items[0].price > items[1].price 
                        ? `Le ${items[0].name} est un investissement plus important mais offre une autonomie supérieure de ${items[0].autonomy}. Pour un usage intensif, c'est le choix de la sérénité. Le ${items[1].name} reste imbattable sur le rapport qualité-prix.`
                        : `Le ${items[1].name} se distingue par sa capacité de ${items[1].capacity_kwh}kWh. Si vous prévoyez d'ajouter des équipements plus tard, c'est l'option la plus évolutive. Le ${items[0].name} est parfait pour vos besoins actuels.`
                      }
                    </p>
                  </div>
                  <div className="shrink-0 w-full md:w-auto">
                    <motion.a 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={`${targetWhatsapp.link}?text=Bonjour, après comparaison, j'hésite entre le ${items[0].name} et le ${items[1].name}. Pouvez-vous m'aider ?`}
                      className="block md:inline-block px-8 lg:px-12 py-4 lg:py-6 bg-white text-emerald-600 rounded-2xl md:rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] lg:text-xs shadow-2xl shadow-black/20 text-center"
                    >
                      Expertise Humaine
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ComparisonModal;
