import React, { useState, useEffect } from 'react';
import { FL_CATALOG, WHATSAPP_CONFIG } from '../constants';
import { Zap, Battery, Tv, Snowflake, Sun, ShoppingCart, Shield, ChevronDown, ChevronUp, Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../db';
import { Product, PackGamme } from '../types';

interface CatalogSectionProps {
  onOrder: (product: Product) => void;
  isOpen: boolean;
}

interface ProductItemProps {
  brand: string;
  name: string;
  price: number;
  currency: string;
  icon: React.ReactNode;
  whatsapp: { link: string; display: string };
  onOrder: () => void;
  capacity?: string;
  warranty?: string;
  index: number;
}

const EXCHANGE_RATE_GNF = 15.5;

const CatalogSection: React.FC<CatalogSectionProps> = ({ onOrder, isOpen }) => {
  const [activeTab, setActiveTab] = useState<'batteries' | 'inverters' | 'panels' | 'appliances'>('batteries');
  const [contactIndex, setContactIndex] = useState(0);
  const currentUser = db.getCurrentUser();

  const isGuinea = currentUser?.pays === "Guinée";
  const currencyLabel = isGuinea ? "GNF" : "F CFA";
  const multiplier = isGuinea ? EXCHANGE_RATE_GNF : 1;

  const contacts = [
    { ...WHATSAPP_CONFIG.CI, flag: '🇨🇮', label: 'Côte d\'Ivoire' },
    { ...WHATSAPP_CONFIG.ML, flag: '🇲🇱', label: 'Mali' },
    { ...WHATSAPP_CONFIG.SN, flag: '🇸🇳', label: 'Sénégal' },
    { ...WHATSAPP_CONFIG.GN, flag: '🇬🇳', label: 'Guinée' },
    { ...WHATSAPP_CONFIG.BF, flag: '🇧🇫', label: 'Burkina Faso' }
  ];

  useEffect(() => {
    if (currentUser?.pays) {
      const idx = contacts.findIndex(c => c.label === currentUser.pays);
      if (idx !== -1) setContactIndex(idx);
    }
  }, [currentUser]);

  const currentContact = contacts[contactIndex];
  
  const handleOrderClick = (brand: string, name: string, price: number) => {
    const transientProduct: Product = {
      id: `cat-${brand}-${name}`.replace(/\s+/g, '-').toLowerCase(),
      gamme: PackGamme.STARTER,
      name: `${brand} - ${name}`,
      price: price,
      acompte: Math.round(price * 0.20),
      monthly: Math.round((price * 0.80) / 20),
      mensualites_nb: 20,
      surface: 'n/a',
      autonomy: 'n/a',
      equipment: [name],
      warranty: '2 ans',
      capacity_kwh: 0,
      max_power: 0,
      image_url: '',
      stock: 10,
      active: true
    };
    onOrder(transientProduct);
  };

  const categories = [
    { id: 'batteries', label: 'Batteries', icon: Battery },
    { id: 'inverters', label: 'Hybrid', icon: Zap },
    { id: 'panels', label: 'Panneaux', icon: Sun },
    { id: 'appliances', label: 'Équipements', icon: Tv },
  ];

  if (!isOpen) return null;

  return (
    <section id="catalog" className="pb-32 md:pb-48 overflow-hidden">
      <div className="container mx-auto px-0 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 border border-emerald-500/20"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Vente au détail</span>
          </motion.div>
          <p id="catalogue-section" className="text-slate-500 dark:text-slate-400 text-xl font-medium leading-relaxed">
            Sélectionnez vos composants à la carte parmi les meilleures marques mondiales certifiées.
          </p>
        </div>

        <div className="flex justify-center mb-12 md:mb-20 px-4">
          <div className="flex flex-wrap md:flex-nowrap justify-center w-full md:w-auto p-2 gap-2 bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveTab(cat.id as any)}
                className={`flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 px-4 py-4 md:px-10 md:py-5 rounded-[1.5rem] md:rounded-[2.5rem] font-black text-[10px] md:text-[11px] uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                  activeTab === cat.id 
                  ? 'bg-emerald-600 text-white shadow-lg md:shadow-2xl shadow-emerald-600/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <cat.icon className="w-5 h-5 md:w-4 md:h-4" />
                <span>{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
          >
            {activeTab === 'batteries' && (
              <>
                {FL_CATALOG.batteries.flatMap((brand, bIdx) => 
                  brand.models.map((model, mIdx) => (
                    <ProductItem 
                      key={`batt-${bIdx}-${mIdx}`} 
                      index={mIdx + bIdx * 10}
                      brand={brand.brand} 
                      name={model.name} 
                      price={Math.round(model.price * multiplier)} 
                      currency={currencyLabel}
                      capacity={(model as any).capacity}
                      warranty={(model as any).warranty}
                      icon={<Battery className="w-7 h-7 text-emerald-500" />} 
                      whatsapp={currentContact} 
                      onOrder={() => handleOrderClick(brand.brand, model.name, model.price)}
                    />
                  ))
                )}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500">
                  <h4 className="text-xl font-black mb-6 uppercase flex items-center gap-3 text-slate-900 dark:text-white"><Battery className="w-6 h-6 text-emerald-600" /> Liste Complète Batteries Lithium</h4>
                  <div className="overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="py-4 md:py-6 pr-4 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 min-w-[140px]">Modèle</th>
                          <th className="py-4 md:py-6 px-4 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 whitespace-nowrap">Prix</th>
                          <th className="py-4 md:py-6 px-4 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 whitespace-nowrap">Garantie</th>
                          <th className="py-4 md:py-6 pl-4 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="font-medium text-slate-700 dark:text-slate-300">
                        {[
                          { m: "Batterie 5 kWh 24V LBPF", p: 615000, w: "5-7 ans" },
                          { m: "Batterie 5 kWh 24V FLA", p: 635000, w: "5-7 ans" },
                          { m: "Batterie 10 kWh FLA", p: 985000, w: "5-7 ans" },
                          { m: "Batterie 15 kWh LBPF", p: 1210000, w: "5-7 ans" },
                          { m: "Batterie 15 kWh FLA", p: 1285000, w: "5-7 ans" },
                          { m: "Batterie 17,5 kWh LBPF", p: 1285000, w: "5-7 ans" },
                          { m: "Batterie 25 kWh FLA", p: 2035000, w: "5-7 ans" },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td className="py-5 pr-4 font-bold text-slate-900 dark:text-white">{row.m}</td>
                            <td className="py-5 px-4 text-emerald-600 font-black whitespace-nowrap">{(row.p * multiplier).toLocaleString()} {currencyLabel}</td>
                            <td className="py-5 px-4 text-slate-500 text-xs font-bold uppercase tracking-wider whitespace-nowrap">{row.w}</td>
                            <td className="py-5 pl-4 text-right">
                              <button 
                                onClick={() => handleOrderClick('Batterie', row.m, row.p)}
                                className="px-5 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white transition-all shadow-lg shadow-slate-900/10"
                              >
                                Commander
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'inverters' && (
              <>
                {FL_CATALOG.inverters.flatMap((brand, bIdx) => 
                  brand.models.map((model, mIdx) => (
                    <ProductItem 
                      key={`inv-${bIdx}-${mIdx}`} 
                      index={mIdx + bIdx * 10}
                      brand={brand.brand} 
                      name={model.name} 
                      price={Math.round(model.price * multiplier)} 
                      currency={currencyLabel}
                      capacity={(model as any).capacity}
                      warranty={(model as any).warranty}
                      icon={<Zap className="w-7 h-7 text-amber-500" />} 
                      whatsapp={currentContact} 
                      onOrder={() => handleOrderClick(brand.brand, model.name, model.price)}
                    />
                  ))
                )}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500">
                  <h4 className="text-xl font-black mb-6 uppercase flex items-center gap-3 text-slate-900 dark:text-white"><Zap className="w-6 h-6 text-amber-500" /> Liste Complète Convertisseurs Hybrides</h4>
                  <div className="overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="py-4 md:py-6 pr-4 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 min-w-[140px]">Puissance</th>
                          <th className="py-4 md:py-6 px-4 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 whitespace-nowrap">Prix</th>
                          <th className="py-4 md:py-6 px-4 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 whitespace-nowrap">Garantie</th>
                          <th className="py-4 md:py-6 pl-4 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="font-medium text-slate-700 dark:text-slate-300">
                        {[
                          { m: "Convertisseur 1 kVA", p: 190000 },
                          { m: "Convertisseur 3 kVA", p: 250000 },
                          { m: "Convertisseur 4 kVA", p: 250000 },
                          { m: "Convertisseur 5 kVA", p: 265000 },
                          { m: "Convertisseur 6 kVA", p: 290000 },
                          { m: "Convertisseur 8 kVA", p: 430000 },
                          { m: "Convertisseur 12 kVA", p: 580000 },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td className="py-5 pr-4 font-bold text-slate-900 dark:text-white">{row.m}</td>
                            <td className="py-5 px-4 text-emerald-600 font-black whitespace-nowrap">{(row.p * multiplier).toLocaleString()} {currencyLabel}</td>
                            <td className="py-5 px-4 text-slate-500 text-xs font-bold uppercase tracking-wider whitespace-nowrap">2 ans</td>
                            <td className="py-5 pl-4 text-right">
                              <button 
                                onClick={() => handleOrderClick('Hybrid', row.m, row.p)}
                                className="px-5 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white transition-all shadow-lg shadow-slate-900/10"
                              >
                                Commander
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'panels' && FL_CATALOG.panels.flatMap((brand, bIdx) => 
              brand.models.map((model, mIdx) => (
                <ProductItem 
                  key={`pan-${bIdx}-${mIdx}`} 
                  index={mIdx + bIdx * 10}
                  brand={brand.brand} 
                  name={model.name} 
                  price={Math.round(model.price * multiplier)} 
                  currency={currencyLabel}
                  capacity={(model as any).capacity}
                  warranty={(model as any).warranty}
                  icon={<Sun className="w-7 h-7 text-yellow-500" />} 
                  whatsapp={currentContact} 
                  onOrder={() => handleOrderClick(brand.brand, model.name, model.price)}
                />
              ))
            )}

            {activeTab === 'appliances' && FL_CATALOG.appliances.flatMap((cat, cIdx) => 
              cat.items.map((item, iIdx) => (
                <ProductItem 
                  key={`app-${cIdx}-${iIdx}`} 
                  index={iIdx + cIdx * 10}
                  brand={cat.category} 
                  name={item.name} 
                  price={Math.round(item.price * multiplier)} 
                  currency={currencyLabel}
                  warranty={(item as any).warranty}
                  whatsapp={currentContact}
                  icon={cat.category.includes('Clim') ? <Snowflake className="w-7 h-7 text-blue-400" /> : <Tv className="w-7 h-7 text-slate-700" />} 
                  onOrder={() => handleOrderClick(cat.category, item.name, item.price)}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>

          {/* NEW CATALOG BLOCKS REMOVED */}
      </div>
    </section>
  );
};

const ProductItem: React.FC<ProductItemProps> = ({ brand, name, price, currency, icon, onOrder, capacity, warranty, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ y: -10 }}
    className="p-6 md:p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] transition-all duration-500 group flex flex-col justify-between"
  >
    <div>
      <div className="flex justify-between items-start mb-6 md:mb-8">
        <div className="p-4 md:p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
          {icon}
        </div>
        <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">{brand}</span>
      </div>
      <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-emerald-600 transition-colors duration-300 font-display">{name}</h4>
      <div className="flex items-baseline gap-3 mb-6 md:mb-8">
        <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter font-display">{price.toLocaleString()}</span>
        <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{currency}</span>
      </div>
      
      <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
        {capacity && (
          <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
            <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600" />
            <span className="text-[9px] md:text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">{capacity}</span>
          </div>
        )}
        {warranty && (
          <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20">
            <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600" />
            <span className="text-[9px] md:text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">{warranty} Garantie</span>
          </div>
        )}
      </div>
    </div>
    <div className="mt-6 md:mt-10">
      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={onOrder}
        className="w-full py-4 md:py-6 bg-slate-950 dark:bg-white dark:text-slate-950 text-white rounded-[1.5rem] text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white transition-all duration-500 flex items-center justify-center gap-4 shadow-xl shadow-slate-950/10 dark:shadow-white/5"
      >
        Commander <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
      </motion.button>
    </div>
  </motion.div>
);

export default CatalogSection;
