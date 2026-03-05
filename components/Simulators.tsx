
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { Calculator, Lightbulb, Zap, Activity, Info, TrendingUp as TrendIcon, ArrowRightLeft, Save, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { SUNWAVE_PACKS, APPLIANCES, COUNTRIES } from '../constants';
import { db } from '../db';
import { Product } from '../types';

interface SimulatorsProps {
  onOrder: (pack: Product, simulatorData?: any) => void;
  onCompare: (pack: Product) => void;
  onOpenComparison: () => void;
  comparisonItems: Product[];
}

const EXCHANGE_RATE_GNF = 15.5;

const Simulators: React.FC<SimulatorsProps> = ({ onOrder, onCompare, onOpenComparison, comparisonItems }) => {
  const [activeTab, setActiveTab] = useState<'savings' | 'autonomy' | 'recommend'>('savings');
  const [monthlyBill, setMonthlyBill] = useState<number>(35000);
  const [selectedComparisonPack, setSelectedComparisonPack] = useState<Product | null>(null);
  const [selectedAppliances, setSelectedAppliances] = useState<Record<string, number>>({
    tv: 1, bulb: 6, fan: 2, fridge: 1
  });

  const currentUser = db.getCurrentUser();
  const [simCountry, setSimCountry] = useState(currentUser?.pays || "Côte d'Ivoire");
  const [isSaved, setIsSaved] = useState(false);

  const isGuinea = simCountry === "Guinée";
  const currencyLabel = isGuinea ? "GNF" : "F CFA";
  const multiplier = isGuinea ? EXCHANGE_RATE_GNF : 1;

  const totalConsumption = useMemo(() => {
    return Object.entries(selectedAppliances).reduce((acc: number, entry: [string, number]) => {
      const [id, count] = entry;
      const app = APPLIANCES.find(a => a.id === id);
      return acc + (app ? app.power * count : 0);
    }, 0);
  }, [selectedAppliances]);

  const recommendedPack = useMemo(() => {
    const peakWatts = totalConsumption || 500;
    if (peakWatts * 1.2 <= 1000) return SUNWAVE_PACKS.find(p => p.id === 'pack-starter')!;
    if (peakWatts * 1.2 <= 3000) return SUNWAVE_PACKS.find(p => p.id === 'pack-essentiel')!;
    if (peakWatts * 1.2 <= 5000) return SUNWAVE_PACKS.find(p => p.id === 'pack-famille')!;
    return SUNWAVE_PACKS.find(p => p.id === 'pack-pro')!;
  }, [totalConsumption]);

  const estimatedAutonomyHours = useMemo(() => {
    if (!recommendedPack || totalConsumption === 0) return 0;
    let usableWh = recommendedPack.capacity_kwh * 1000 * 0.9;
    const hours = usableWh / totalConsumption;
    return parseFloat(Math.min(24, hours).toFixed(1));
  }, [recommendedPack, totalConsumption]);

  const savingsData = useMemo(() => {
    const years = [1, 3, 5, 9];
    const fCIE = monthlyBill || 35000;
    const fReelle = fCIE * 1.60;
    const pack = recommendedPack;
    const prixPack = pack.acompte + (pack.monthly * 20);

    return years.map(y => {
      const months = y * 12;
      const costSans = fReelle * months;
      
      let costAvec = 0;
      if (months <= 20) {
        costAvec = pack.acompte + (pack.monthly * months) + (fCIE * 0.20 * months);
      } else {
        costAvec = prixPack + (fCIE * 0.20 * 20) + (fCIE * 0.05 * (months - 20));
      }

      return {
        year: `${y} Ans`,
        totalBill: Math.round(costSans * multiplier),
        withSunwave: Math.round(costAvec * multiplier),
      };
    });
  }, [monthlyBill, multiplier, recommendedPack]);

  const updateAppliance = (id: string, delta: number) => {
    setSelectedAppliances(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-white/10 shadow-2xl text-[10px] font-bold">
          <p className="mb-2 opacity-50 uppercase tracking-widest">{label}</p>
          <p className="flex justify-between gap-4 mb-1">
            <span className="text-slate-400">Classique:</span> 
            <span>{payload[0].value.toLocaleString()} {currencyLabel}</span>
          </p>
          <p className="flex justify-between gap-4 text-emerald-400">
            <span>Sunwave:</span> 
            <span>{payload[1].value.toLocaleString()} {currencyLabel}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const handleValidation = () => {
    onOrder(recommendedPack, {
      consumption: totalConsumption,
      autonomy: estimatedAutonomyHours,
      appliances: selectedAppliances,
      monthlyBill: monthlyBill
    });
  };

  const handleSaveSim = () => {
    if (!currentUser) return;
    db.saveSimulation(currentUser.id, {
      consumption: totalConsumption,
      autonomy: estimatedAutonomyHours,
      appliances: selectedAppliances,
      monthlyBill: monthlyBill,
      packId: recommendedPack.id
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <motion.section 
      id="simulator" 
      className="py-24 bg-slate-50 dark:bg-slate-950/50 scroll-mt-24"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-fluid-h2 font-black mb-6 text-slate-900 dark:text-white uppercase tracking-tighter">Analyse de Rentabilité</h2>
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
             {COUNTRIES.map(c => (
               <button key={c.code} onClick={() => setSimCountry(c.name)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${simCountry === c.name ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                 {c.flag} {c.name}
               </button>
             ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-[32px] md:rounded-[40px] p-6 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-12 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-3xl w-fit mx-auto md:mx-0">
            {[
              { id: 'savings', label: 'Gains', icon: <Calculator className="w-4 h-4" /> },
              { id: 'autonomy', label: 'Autonomie', icon: <Activity className="w-4 h-4" /> },
              { id: 'recommend', label: 'Conseil IA', icon: <Lightbulb className="w-4 h-4" /> }
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xl' : 'text-slate-400'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[300px] md:min-h-[400px]">
            {activeTab === 'savings' && (
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Votre facture mensuelle CIE</label>
                      <div className="text-right">
                        <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Coût Réel (CIE + Pertes + Carburant facultatif)</p>
                        <p className="text-sm font-black text-blue-500">{(monthlyBill * 1.60 * multiplier).toLocaleString()} {currencyLabel}</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl md:text-5xl font-black text-emerald-600">{(monthlyBill * multiplier).toLocaleString()}</span>
                      <span className="text-sm font-black text-slate-400">{currencyLabel}</span>
                    </div>
                    <input type="range" min="10000" max="500000" step="5000" value={monthlyBill} onChange={(e) => setMonthlyBill(Number(e.target.value))} className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 touch-none" />
                    <p className="mt-4 text-[10px] font-medium text-slate-500 leading-relaxed italic">
                      "Le coût réel inclut votre facture CIE + 60% de frais liés aux coupures (pertes d'aliments, appareils grillés) et au carburant (si vous avez un groupe)."
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 md:p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800">
                      <p className="text-[9px] md:text-[10px] font-black uppercase text-emerald-600 mb-2">Gain Mensuel Net</p>
                      <p className="text-lg md:text-xl font-black text-emerald-600">+{Math.round((monthlyBill * 1.60 - recommendedPack.monthly - (monthlyBill * 0.20)) * multiplier).toLocaleString()} {currencyLabel}</p>
                      <p className="text-[8px] font-bold text-emerald-600/60 mt-1 uppercase">Économie immédiate</p>
                    </div>
                    <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 mb-2">Nouveau Coût (P1)</p>
                      <p className="text-lg md:text-xl font-black text-slate-900 dark:text-white">{Math.round((recommendedPack.monthly + (monthlyBill * 0.20)) * multiplier).toLocaleString()} {currencyLabel}</p>
                      <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Mensualité + 20% CIE</p>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 bg-slate-900 text-white rounded-[32px] shadow-2xl relative overflow-hidden group">
                    <TrendIcon className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Économies sur 9 ans</p>
                      <p className="text-3xl md:text-4xl font-black text-emerald-400">
                        {Math.round(((monthlyBill * 1.60 * 108) - (recommendedPack.acompte + (recommendedPack.monthly * 20) + (monthlyBill * 0.20 * 20) + (monthlyBill * 0.05 * 88))) * multiplier).toLocaleString()} {currencyLabel}
                      </p>
                      <button onClick={() => setActiveTab('recommend')} className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-emerald-400 transition-colors">
                        Voir le pack recommandé <ArrowRightLeft className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="h-[300px] md:h-[400px] w-full bg-slate-50 dark:bg-slate-800/50 rounded-[40px] p-6 md:p-8 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Projection d'économies</h4>
                    <div className="flex gap-2">
                       <div className="flex items-center gap-1.5">
                         <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                         <span className="text-[8px] font-bold text-slate-400 uppercase">Actuel</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                         <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                         <span className="text-[8px] font-bold text-slate-400 uppercase">Sunwave</span>
                       </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={savingsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                      <XAxis dataKey="year" tick={{fontSize: 9, fontWeight: 800}} axisLine={false} tickLine={false} dy={10} />
                      <YAxis hide domain={[0, 'auto']} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                      <Bar dataKey="totalBill" fill="#cbd5e1" radius={[8, 8, 0, 0]} barSize={40} />
                      <Bar dataKey="withSunwave" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'autonomy' && (
              <div className="grid lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="space-y-8">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Info className="w-3.5 h-3.5" /> Simulation Équipements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                       {APPLIANCES.map(app => (
                          <div key={app.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between border-2 border-transparent hover:border-emerald-500/20 transition-all">
                             <div className="flex items-center gap-3">
                                <span className="text-2xl">{app.icon}</span>
                                <div>
                                   <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white leading-none">{app.name}</p>
                                   <p className="text-[8px] font-bold text-slate-400 mt-1">{app.power}W</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-3">
                                <button onClick={() => updateAppliance(app.id, -1)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center font-black text-slate-400 hover:text-emerald-600 transition-colors shadow-sm">-</button>
                                <span className="text-xs font-black w-4 text-center dark:text-white">{selectedAppliances[app.id] || 0}</span>
                                <button onClick={() => updateAppliance(app.id, 1)} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center font-black text-slate-400 hover:text-emerald-600 transition-colors shadow-sm">+</button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-emerald-600 rounded-[40px] p-10 text-white flex flex-col justify-center text-center space-y-6 relative overflow-hidden shadow-2xl">
                    <Zap className="absolute -right-10 -bottom-10 w-48 h-48 opacity-10" />
                    <div className="relative z-10">
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Pic Estimé</p>
                       <p className="text-6xl font-black tracking-tighter">{totalConsumption}W</p>
                    </div>
                    <div className="relative z-10 mt-8 bg-white/10 p-8 rounded-[32px] border border-white/20 backdrop-blur-md">
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Autonomie de nuit</p>
                       <p className="text-6xl font-black tracking-tighter">{estimatedAutonomyHours}h</p>
                       <p className="text-[9px] font-black uppercase opacity-40 mt-4 tracking-widest">Via Pack {recommendedPack.gamme}</p>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'recommend' && (
              <div className="animate-in zoom-in-95 duration-500">
                 <div className="grid lg:grid-cols-[1fr_0.6fr] gap-8 items-start">
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-10 md:p-12 rounded-[50px] border-2 border-emerald-600/20 shadow-xl text-center">
                       <div className="w-20 h-20 bg-emerald-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                         <Lightbulb className="w-10 h-10" />
                       </div>
                       <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase mb-4 tracking-tighter">Votre Solution : {recommendedPack.name}</h3>
                       <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium max-w-md mx-auto">Dimensionné pour {totalConsumption}W de charge continue avec batteries Lithium haute densité.</p>
                       
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                             <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Panneaux</p>
                             <p className="text-sm font-black text-emerald-600">{recommendedPack.panels_count}x {recommendedPack.panel_wattage}W</p>
                          </div>
                          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                             <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Batterie</p>
                             <p className="text-sm font-black text-emerald-600">{recommendedPack.capacity_kwh} kWh</p>
                          </div>
                          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                             <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Onduleur</p>
                             <p className="text-sm font-black text-emerald-600">{recommendedPack.inverter_kva} kVA</p>
                          </div>
                          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                             <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Garantie</p>
                             <p className="text-sm font-black text-emerald-600">5 Ans</p>
                          </div>
                       </div>

                       <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <button onClick={handleValidation} className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-emerald-500 transition-all active:scale-95">Valider & Commander</button>
                          {currentUser && (
                            <button 
                              onClick={handleSaveSim} 
                              className={`px-8 py-5 border-2 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                                isSaved 
                                ? 'bg-emerald-50 border-emerald-600 text-emerald-600' 
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                              {isSaved ? 'Enregistré' : 'Sauvegarder'}
                            </button>
                          )}
                          <button 
                            onClick={() => onCompare(recommendedPack)} 
                            className={`px-10 py-5 border-2 rounded-2xl font-black uppercase tracking-widest transition-all ${
                               comparisonItems.some(p => p.id === recommendedPack.id)
                               ? 'bg-emerald-600 text-white border-emerald-600'
                               : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {comparisonItems.some(p => p.id === recommendedPack.id) ? 'Dans le duel' : 'Ajouter au duel'}
                          </button>
                       </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                          <ArrowRightLeft className="w-4 h-4 text-emerald-600" /> Comparer avec un autre pack
                       </h4>
                       <div className="space-y-3">
                          {SUNWAVE_PACKS.filter(p => p.id !== recommendedPack.id).map(pack => (
                             <div 
                                key={pack.id}
                                className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between group ${
                                   selectedComparisonPack?.id === pack.id 
                                   ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' 
                                   : 'border-slate-100 dark:border-slate-800 hover:border-emerald-500/30'
                                }`}
                             >
                                <div className="flex-1 cursor-pointer" onClick={() => setSelectedComparisonPack(pack)}>
                                   <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">{pack.gamme}</p>
                                   <p className="text-sm font-black text-slate-900 dark:text-white">{pack.name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                   <button 
                                     onClick={() => onCompare(pack)}
                                     className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                                       comparisonItems.some(p => p.id === pack.id)
                                       ? 'bg-emerald-600 text-white'
                                       : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-600'
                                     }`}
                                   >
                                     {comparisonItems.some(p => p.id === pack.id) ? 'Sélectionné' : 'Ajouter au duel'}
                                   </button>
                                   <div 
                                     onClick={() => setSelectedComparisonPack(pack)}
                                     className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                                       selectedComparisonPack?.id === pack.id ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-200 dark:border-slate-700'
                                     }`}
                                   >
                                      {selectedComparisonPack?.id === pack.id && <Zap className="w-3 h-3" />}
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                       {selectedComparisonPack && (
                          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2">
                             <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                                <p className="text-[9px] font-black uppercase text-blue-600 mb-2 flex items-center gap-2">
                                   <Info className="w-3 h-3" /> Analyse Comparative
                                </p>
                                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                                   {selectedComparisonPack.price > recommendedPack.price 
                                      ? `Le ${selectedComparisonPack.name} offre plus de réserve (${selectedComparisonPack.capacity_kwh}kWh) mais coûte ${(selectedComparisonPack.price - recommendedPack.price).toLocaleString()} F de plus. Le ${recommendedPack.name} reste le choix optimal pour votre consommation de ${totalConsumption}W.`
                                      : `Le ${selectedComparisonPack.name} est plus économique mais pourrait être juste pour vos pics de ${totalConsumption}W. Nous recommandons de rester sur le ${recommendedPack.name} pour une sérénité totale.`
                                   }
                                </p>
                             </div>
                             <button 
                               onClick={() => {
                                  if (!comparisonItems.some(p => p.id === recommendedPack.id)) onCompare(recommendedPack);
                                  if (!comparisonItems.some(p => p.id === selectedComparisonPack.id)) onCompare(selectedComparisonPack);
                                  setTimeout(onOpenComparison, 100);
                               }}
                               className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-3 group"
                             >
                                <ArrowRightLeft className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                Comparer en détail
                             </button>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Simulators;
