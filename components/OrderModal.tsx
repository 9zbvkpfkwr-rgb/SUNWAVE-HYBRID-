import React, { useState, useEffect, useMemo } from 'react';
import { X, CheckCircle2, Loader2, AlertTriangle, Smartphone, CreditCard, ShieldCheck, MessageSquareQuote, Navigation, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, PaymentMode } from '../types';
import { db } from '../db';
import { COUNTRIES } from '../constants';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onRedirectToChat: (orderData: any) => void;
}

const EXCHANGE_RATE_GNF = 15.5;

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, product, onRedirectToChat }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    gps: '',
    ville: 'Abidjan',
    pays: "Côte d'Ivoire",
    modePaiement: 'Wave' as PaymentMode
  });

  useEffect(() => {
    const user = db.getCurrentUser();
    if (user && isOpen) {
      setFormData(prev => ({
        ...prev,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        ville: user.ville || prev.ville,
        pays: user.pays || "Côte d'Ivoire"
      }));
    }
    if (!isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  const selectedCountry = useMemo(() => {
    return COUNTRIES.find(c => c.name === formData.pays) || COUNTRIES[0];
  }, [formData.pays]);

  const isGuinea = formData.pays === "Guinée";
  const currencyLabel = isGuinea ? "GNF" : "F CFA";
  const multiplier = isGuinea ? EXCHANGE_RATE_GNF : 1;

  const finalAcompte = product ? Math.round(product.acompte * multiplier) : 0;
  const finalMonthly = product ? Math.round(product.monthly * multiplier) : 0;

  const handleGeoLocate = () => {
    if (!navigator.geolocation) {
      setGeoError("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }
    setIsLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const rawCoords = `${latitude.toFixed(7)}, ${longitude.toFixed(7)}`;
        setFormData(prev => ({ ...prev, gps: rawCoords }));
        setIsLocating(false);
        if (window.navigator.vibrate) window.navigator.vibrate(20);
      },
      (error) => {
        let msg = "Erreur GPS. Veuillez activer la localisation.";
        if (error.code === error.PERMISSION_DENIED) msg = "Accès GPS refusé. Veuillez l'activer dans vos réglages.";
        setGeoError(msg);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gps) {
        setGeoError("La localisation GPS est obligatoire pour la livraison.");
        return;
    }
    setStep(2);
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    const currentUser = db.getCurrentUser();
    
    const order = db.createOrder({
      client_id: currentUser?.id || 'GUEST',
      produit_id: product!.id,
      mode_paiement: formData.modePaiement,
      montant_total: product!.price * multiplier,
      acompte_paye: finalAcompte,
      mensualites_nb: product!.mensualites_nb,
      mensualite_montant: finalMonthly,
      adresse_livraison: `${formData.ville}, ${formData.adresse}`,
      pays: formData.pays,
      ville: formData.ville,
      gps_coordinates: formData.gps,
    });

    setIsSubmitting(false);
    onClose();
    
    onRedirectToChat({
      orderId: order.id,
      clientId: currentUser?.id,
      clientName: `${currentUser?.prenom} ${currentUser?.nom}`,
      amount: finalAcompte,
      currency: currencyLabel,
      method: formData.modePaiement,
      country: formData.pays,
      productName: product?.name
    });
  };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 sm:p-4 md:p-8">
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
            className="relative bg-white dark:bg-slate-900 w-full max-w-2xl h-full sm:h-auto sm:max-h-[95vh] sm:rounded-[4rem] overflow-hidden shadow-[0_64px_128px_-24px_rgba(0,0,0,0.5)] flex flex-col border-none md:border md:border-slate-800"
          >
            <div className="flex-1 overflow-y-auto p-10 sm:p-16 no-scrollbar pb-safe">
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose} 
                className="absolute top-10 right-10 p-4 bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] z-10 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group"
              >
                <X className="w-7 h-7 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
              </motion.button>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-12"
                  >
                    <div className="pt-4">
                      <div className="flex items-center gap-5 mb-6">
                        <div className="w-14 h-14 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-600/20">
                          <Navigation className="w-7 h-7" />
                        </div>
                        <div>
                          <h2 className="text-[2.5rem] font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Installation</h2>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] mt-2">Étape 1 : Localisation Précise</p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleNextToPayment} className="space-y-10">
                      <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-3">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Pays de résidence</label>
                              <div className="relative">
                                <select 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-[2rem] px-8 py-6 text-base font-black transition-all dark:text-white appearance-none cursor-pointer shadow-sm" 
                                    value={formData.pays} 
                                    onChange={e => setFormData({...formData, pays: e.target.value})}
                                >
                                    {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                                </select>
                              </div>
                          </div>
                          <div className="space-y-3">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Ville</label>
                              <input 
                                  list="city-suggestions"
                                  required 
                                  placeholder="Votre ville..."
                                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-[2rem] px-8 py-6 text-base font-black transition-all dark:text-white shadow-sm" 
                                  value={formData.ville} 
                                  onChange={e => setFormData({...formData, ville: e.target.value})} 
                              />
                              <datalist id="city-suggestions">
                                  {selectedCountry.cities.map(city => <option key={city} value={city} />)}
                              </datalist>
                          </div>
                      </div>

                      <div className="space-y-6">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-3">
                            Géolocalisation du site <span className="text-emerald-600 italic">(Obligatoire)</span>
                          </label>
                          
                          {geoError && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-5 p-6 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 rounded-[2.5rem]"
                              >
                                  <AlertTriangle className="w-7 h-7 text-red-600 shrink-0" />
                                  <p className="text-[12px] font-black text-red-800 dark:text-red-400 leading-tight uppercase tracking-widest">{geoError}</p>
                              </motion.div>
                          )}

                          <motion.button 
                              whileTap={{ scale: 0.98 }}
                              type="button" 
                              onClick={handleGeoLocate} 
                              disabled={isLocating}
                              className={`w-full py-8 rounded-[2.5rem] font-black text-base uppercase tracking-[0.25em] flex items-center justify-center gap-6 transition-all duration-500 relative overflow-hidden group shadow-2xl ${
                                  formData.gps 
                                  ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                                  : 'bg-slate-950 text-white ring-8 ring-emerald-500/5'
                              }`}
                          >
                              {isLocating ? (
                                  <Loader2 className="w-8 h-8 animate-spin" />
                              ) : (
                                  <Navigation className={`w-8 h-8 ${formData.gps ? 'fill-current' : ''} transition-transform group-hover:rotate-12`} />
                              )}
                              <span className="relative z-10">
                                  {formData.gps ? 'Position GPS Validée' : 'Localiser mon toit'}
                              </span>
                          </motion.button>
                          
                          {formData.gps && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-4 px-6 py-4 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-500/10 w-fit mx-auto shadow-sm"
                              >
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                  <span className="text-[12px] font-mono font-black text-emerald-700 dark:text-emerald-400 tracking-widest">{formData.gps}</span>
                              </motion.div>
                          )}
                      </div>

                      <div className="space-y-3">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Complément d'adresse</label>
                          <textarea 
                              required 
                              placeholder="Quartier, rue, n° de porte ou repères visuels..." 
                              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-[3rem] px-10 py-10 text-base font-black dark:text-white min-h-[160px] transition-all resize-none shadow-sm" 
                              value={formData.adresse} 
                              onChange={e => setFormData({...formData, adresse: e.target.value})} 
                          />
                      </div>

                      <motion.button 
                          whileTap={{ scale: 0.98 }}
                          type="submit" 
                          className="w-full py-8 bg-emerald-600 text-white rounded-[3rem] font-black text-xl uppercase tracking-[0.3em] hover:bg-emerald-500 transition-all duration-500 shadow-2xl shadow-emerald-600/20 flex items-center justify-center gap-4 group"
                      >
                          Continuer <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                      </motion.button>
                    </form>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    <div className="pt-4">
                      <div className="flex items-center gap-5 mb-6">
                        <div className="w-14 h-14 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-600/20">
                          <CreditCard className="w-7 h-7" />
                        </div>
                        <div>
                          <h2 className="text-[2.5rem] font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Paiement</h2>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] mt-2">Étape 2 : Mode de règlement</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-10 bg-amber-50 dark:bg-amber-500/5 border-2 border-amber-100 dark:border-amber-500/10 rounded-[3rem] space-y-5 relative overflow-hidden group shadow-sm"
                      >
                         <ShieldCheck className="absolute -right-10 -bottom-10 w-32 h-32 text-amber-600/10 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
                         <h4 className="text-[12px] font-black text-amber-600 uppercase tracking-[0.3em] flex items-center gap-4">
                           <ShieldCheck className="w-6 h-6" /> Sécurité des Transactions
                         </h4>
                         <p className="text-[12px] font-black text-slate-600 dark:text-slate-400 leading-relaxed uppercase tracking-widest">
                           Votre acompte est <span className="text-amber-600">gelé sous séquestre</span>. Il n'est débloqué qu'après l'installation finale et signature du bon de livraison.
                         </p>
                      </motion.div>

                      <div className="grid grid-cols-1 gap-6">
                         {[
                           { id: 'Wave', label: 'Mobile Money', icon: <Smartphone className="w-8 h-8" />, desc: 'Wave, Orange, MTN, Moov' },
                           { id: 'Carte', label: 'Carte Visa / Virement', icon: <CreditCard className="w-8 h-8" />, desc: 'Paiement sécurisé ou RIB' }
                         ].map(mode => (
                           <motion.button 
                            key={mode.id} 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFormData({...formData, modePaiement: mode.id as PaymentMode})} 
                            className={`p-10 rounded-[3rem] border-2 transition-all duration-500 text-left flex items-center gap-8 group ${formData.modePaiement === mode.id ? 'border-emerald-600 bg-emerald-50/10 shadow-2xl shadow-emerald-600/10' : 'border-slate-50 dark:border-slate-800 hover:border-emerald-500/30 bg-slate-50/50 dark:bg-slate-800/30'}`}
                           >
                              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 ${formData.modePaiement === mode.id ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-600/20' : 'bg-white dark:bg-slate-700 text-slate-400'}`}>
                                {mode.icon}
                              </div>
                              <div>
                                 <p className={`text-[12px] font-black uppercase tracking-[0.3em] ${formData.modePaiement === mode.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>{mode.label}</p>
                                 <p className="text-[11px] font-black text-slate-400 mt-2 uppercase tracking-widest opacity-60">{mode.desc}</p>
                              </div>
                           </motion.button>
                         ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-6 pt-6">
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          onClick={handleFinalSubmit} 
                          disabled={isSubmitting} 
                          className="w-full py-8 bg-slate-950 dark:bg-white dark:text-slate-950 text-white rounded-[3rem] font-black text-xl uppercase tracking-[0.3em] flex items-center justify-center gap-5 hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white transition-all duration-500 shadow-2xl disabled:opacity-50"
                        >
                          {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <>Finaliser sur l'Assistant <MessageSquareQuote className="w-8 h-8" /></>}
                        </motion.button>
                        <motion.button 
                          whileHover={{ x: -5 }}
                          onClick={() => setStep(1)} 
                          className="w-full py-4 text-[11px] font-black uppercase text-slate-400 tracking-[0.4em] hover:text-emerald-600 flex items-center justify-center gap-3 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" /> Retour à la localisation
                        </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrderModal;
