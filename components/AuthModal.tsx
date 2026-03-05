import React, { useState, useMemo, useEffect } from 'react';
import { X, User, Mail, Loader2, ArrowRight, CheckCircle2, Building2, UserCircle2, Lock, UserPlus, Globe, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../db';
import { COUNTRIES } from '../constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role?: string) => void;
  initialMessage?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, initialMessage }) => {
  const [step, setStep] = useState<'phone' | 'register' | 'admin_pass'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [phone, setPhone] = useState('');
  const [selectedDial, setSelectedDial] = useState('+225');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    entreprise_nom: '',
    idu: '',
    ncc: '',
    pays: "Côte d'Ivoire" as any,
    ville: '',
    quartier: '',
    type_profil: 'particulier' as 'particulier' | 'pro',
    referred_by: ''
  });

  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setIsLoading(false);
      setIsSuccess(false);
      setError(null);
      setPhone('');
      setPassword('');
    }
  }, [isOpen]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawNumber = phone.trim().replace(/\s/g, '');
    const cleanPhoneWithDial = `${selectedDial.replace('+', '')}${rawNumber}`;
    setError(null);

    if (cleanPhoneWithDial === '22507090001') {
      setStep('admin_pass');
      return;
    }

    if (rawNumber.length < 8) {
      setError("Veuillez saisir un numéro de téléphone valide (min. 8 chiffres).");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      try {
        const fullPhone = `${selectedDial}${rawNumber}`;
        const exists = db.checkPhoneExists(fullPhone);
        if (exists) {
          db.loginByPhone(fullPhone);
          completeAuth('client');
        } else {
          setError("Ce numéro n'est pas reconnu dans notre système.");
          setIsLoading(false);
        }
      } catch (err) {
        setError("Erreur de connexion.");
        setIsLoading(false);
      }
    }, 800);
  };

  const handleAdminPassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        const admin = db.adminLogin('22507090001', password);
        if (admin) {
          completeAuth('admin');
        } else {
          setError("Mot de passe incorrect.");
          setIsLoading(false);
        }
      } catch (err) {
        setError("Erreur d'accès.");
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        const fullPhone = `${selectedDial}${phone.trim().replace(/\s/g, '')}`;
        db.register({
          ...formData,
          telephone: fullPhone,
          source: 'formulaire_web',
          role: 'client'
        });
        completeAuth('client');
      } catch (err) {
        setError("L'inscription a échoué.");
        setIsLoading(false);
      }
    }, 1000);
  };

  const completeAuth = (role: string) => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onSuccess(role);
      onClose();
    }, 1000);
  };

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-slate-900 w-full md:max-w-2xl h-[100dvh] sm:h-[90dvh] md:h-auto md:max-h-[85vh] rounded-none sm:rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col border-none md:border md:border-slate-100 dark:md:border-slate-800 pt-16 sm:pt-20 md:pt-24"
          >
            
            <div className="flex-1 overflow-y-auto p-6 md:p-12 pb-safe scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-thumb-rounded-full">
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose} 
                className="absolute top-6 right-6 md:top-10 md:right-10 p-3 md:p-4 bg-slate-100 dark:bg-slate-800 rounded-full md:rounded-[1.5rem] transition-all z-20 group shadow-sm"
              >
                <X className="w-5 h-5 md:w-6 md:h-6 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
              </motion.button>

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div 
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8 md:space-y-10 pt-8 md:pt-4"
                  >
                    <div className="text-center">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-16 h-16 md:w-24 md:h-24 ${step === 'admin_pass' ? 'bg-slate-950' : 'bg-emerald-600'} rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-6 md:mb-8 shadow-xl shadow-emerald-600/20 transition-colors`}
                      >
                        {step === 'admin_pass' ? <Lock className="w-8 h-8 md:w-12 md:h-12" /> : <User className="w-8 h-8 md:w-12 md:h-12" />}
                      </motion.div>
                      <h2 className="text-3xl md:text-[3rem] font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none mb-3">
                        {step === 'phone' ? 'Identification' : step === 'admin_pass' ? 'Admin HQ' : 'Dernière étape'}
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg font-medium px-4">
                        {step === 'admin_pass' ? 'Entrez votre code secret.' : initialMessage || 'Veuillez sélectionner votre pays et saisir votre numéro.'}
                      </p>
                    </div>

                    {step === 'phone' && (
                      <form onSubmit={handlePhoneSubmit} className="space-y-6 md:space-y-8">
                        {error && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 p-4 md:p-6 rounded-2xl md:rounded-[2rem]"
                          >
                            <p className="text-amber-700 dark:text-amber-400 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-4">{error}</p>
                            {error.includes("pas reconnu") && (
                              <motion.button 
                                whileHover={{ x: 5 }}
                                type="button"
                                onClick={() => { setStep('register'); setError(null); }}
                                className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] group"
                              >
                                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" /> Créer un compte
                              </motion.button>
                            )}
                          </motion.div>
                        )}
                        <div className="space-y-3 md:space-y-4">
                          <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 dark:text-slate-300">Pays d'origine</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                             {COUNTRIES.map(c => {
                               const isSelected = selectedDial === c.dial;
                               return (
                               <motion.button 
                                 key={c.code}
                                 whileHover={{ scale: 1.05, y: -2 }}
                                 whileTap={{ scale: 0.95 }}
                                 type="button"
                                 onClick={() => {
                                   setSelectedDial(c.dial);
                                   setFormData({...formData, pays: c.name as any});
                                 }}
                                 className={`relative group flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 py-4 md:py-5 rounded-2xl md:rounded-[1.5rem] border-2 transition-all duration-300 overflow-hidden ${
                                   isSelected 
                                   ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 shadow-xl shadow-emerald-600/10 z-10' 
                                   : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-200 dark:hover:border-emerald-800'
                                 }`}
                               >
                                 <span className="text-3xl md:text-4xl drop-shadow-md transition-transform duration-300 group-hover:scale-110">{c.flag}</span>
                                 <span className={`text-xs md:text-sm font-black tracking-widest transition-colors ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {c.dial}
                                 </span>
                                 
                                 {isSelected && (
                                    <motion.div 
                                        layoutId="active-country-indicator"
                                        className="absolute top-3 right-3 w-2 h-2 md:w-3 md:h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    />
                                 )}
                               </motion.button>
                             )})}
                          </div>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                          <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Numéro de téléphone</label>
                          <div className="flex gap-3">
                            <div className="bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-xl md:rounded-[1.5rem] px-4 md:px-6 py-4 md:py-5 text-sm md:text-base font-black flex items-center gap-2 md:gap-3 text-slate-400 shadow-sm shrink-0">
                               <Globe className="w-4 h-4 md:w-5 md:h-5" /> {selectedDial}
                            </div>
                            <input 
                              type="tel"
                              required
                              className="flex-1 w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-xl md:rounded-[1.5rem] px-4 md:px-8 py-4 md:py-5 text-lg md:text-xl font-black focus:ring-0 focus:border-emerald-500 transition-all text-slate-900 dark:text-white shadow-sm placeholder:text-slate-300"
                              value={phone}
                              onChange={e => setPhone(e.target.value)}
                              placeholder="0701020304"
                            />
                          </div>
                        </div>

                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isLoading || phone.length < 5}
                          className="w-full py-5 md:py-7 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl md:rounded-[2.5rem] font-black text-sm md:text-lg uppercase tracking-[0.2em] flex items-center justify-center gap-3 md:gap-4 hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white transition-all duration-500 active:scale-95 disabled:opacity-50 shadow-xl"
                        >
                          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Valider mon accès <ArrowRight className="w-5 h-5" /></>}
                        </motion.button>
                      </form>
                    )}

                    {step === 'admin_pass' && (
                      <form onSubmit={handleAdminPassSubmit} className="space-y-8 md:space-y-10">
                        {error && <p className="text-red-500 text-[10px] md:text-[12px] font-black text-center bg-red-50 dark:bg-red-500/5 p-4 rounded-2xl animate-bounce uppercase tracking-widest">{error}</p>}
                        <div className="space-y-4 text-center">
                          <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Code Secret Administrateur</label>
                          <input 
                            type="password"
                            required
                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[2rem] md:rounded-[2.5rem] px-6 py-6 md:px-10 md:py-8 text-4xl md:text-[3.5rem] font-black focus:ring-0 focus:border-slate-950 transition-all text-slate-900 dark:text-white text-center tracking-[0.4em] md:tracking-[0.6em] shadow-inner leading-none"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••"
                            autoFocus
                          />
                        </div>
                        <div className="space-y-4">
                          <motion.button 
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-5 md:py-7 bg-slate-950 text-white rounded-2xl md:rounded-[2.5rem] font-black text-sm md:text-lg uppercase tracking-[0.2em] flex items-center justify-center gap-3 md:gap-4 active:scale-95 transition-all duration-500 shadow-xl"
                          >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Déverrouiller HQ <ArrowRight className="w-5 h-5" /></>}
                          </motion.button>
                          <motion.button 
                            whileHover={{ x: -5 }}
                            type="button" 
                            onClick={() => setStep('phone')} 
                            className="w-full text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-center hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <ChevronLeft className="w-4 h-4" /> Utiliser un autre identifiant
                          </motion.button>
                        </div>
                      </form>
                    )}

                    {step === 'register' && (
                      <form onSubmit={handleRegisterSubmit} className="space-y-6 md:space-y-8 pb-8">
                        <div className="space-y-3 md:space-y-4">
                          <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Profil du compte</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => setFormData({...formData, type_profil: 'particulier'})}
                              className={`p-5 md:p-6 rounded-2xl md:rounded-[2rem] border-2 transition-all duration-500 text-left group flex items-center gap-4 sm:block ${formData.type_profil === 'particulier' ? 'border-emerald-600 bg-emerald-50/10 shadow-xl shadow-emerald-600/5' : 'border-slate-100 dark:border-slate-800 hover:border-emerald-500/30'}`}
                            >
                              <UserCircle2 className={`w-8 h-8 md:w-10 md:h-10 sm:mb-4 transition-transform group-hover:scale-110 ${formData.type_profil === 'particulier' ? 'text-emerald-600' : 'text-slate-400'}`} />
                              <p className={`text-[11px] md:text-[12px] font-black uppercase tracking-widest ${formData.type_profil === 'particulier' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>Particulier</p>
                            </motion.button>
      
                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => setFormData({...formData, type_profil: 'pro'})}
                              className={`p-5 md:p-6 rounded-2xl md:rounded-[2rem] border-2 transition-all duration-500 text-left group flex items-center gap-4 sm:block ${formData.type_profil === 'pro' ? 'border-brand-orange bg-orange-50/10 shadow-xl shadow-orange-600/5' : 'border-slate-100 dark:border-slate-800 hover:border-brand-orange/30'}`}
                            >
                              <Building2 className={`w-8 h-8 md:w-10 md:h-10 sm:mb-4 transition-transform group-hover:scale-110 ${formData.type_profil === 'pro' ? 'text-brand-orange' : 'text-slate-400'}`} />
                              <p className={`text-[11px] md:text-[12px] font-black uppercase tracking-widest ${formData.type_profil === 'pro' ? 'text-brand-orange' : 'text-slate-500 dark:text-slate-400'}`}>Professionnel</p>
                            </motion.button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Prénom *</label>
                                <input required className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-xl md:rounded-[1.5rem] px-5 py-4 md:px-6 md:py-5 text-sm md:text-base font-black dark:text-white shadow-sm transition-all" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nom *</label>
                                <input required className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-xl md:rounded-[1.5rem] px-5 py-4 md:px-6 md:py-5 text-sm md:text-base font-black dark:text-white shadow-sm transition-all" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} />
                            </div>
                        </div>

                        {formData.type_profil === 'pro' && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                          >
                            <div className="space-y-2">
                                <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nom Commercial *</label>
                                <input required className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-brand-orange rounded-xl md:rounded-[1.5rem] px-5 py-4 md:px-6 md:py-5 text-sm md:text-base font-black dark:text-white shadow-sm transition-all" value={formData.entreprise_nom} onChange={e => setFormData({...formData, entreprise_nom: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">IDU (RCCM) *</label>
                                    <input required className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-brand-orange rounded-xl md:rounded-[1.5rem] px-5 py-4 md:px-6 md:py-5 text-sm md:text-base font-black dark:text-white shadow-sm transition-all" value={formData.idu} onChange={e => setFormData({...formData, idu: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">NCC *</label>
                                    <input required className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-brand-orange rounded-xl md:rounded-[1.5rem] px-5 py-4 md:px-6 md:py-5 text-sm md:text-base font-black dark:text-white shadow-sm transition-all" value={formData.ncc} onChange={e => setFormData({...formData, ncc: e.target.value})} />
                                </div>
                            </div>
                          </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email *</label>
                            <input type="email" required className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-xl md:rounded-[1.5rem] px-5 py-4 md:px-6 md:py-5 text-sm md:text-base font-black dark:text-white shadow-sm transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Ville *</label>
                                <input required className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-xl md:rounded-[1.5rem] px-5 py-4 md:px-6 md:py-5 text-sm md:text-base font-black dark:text-white shadow-sm transition-all" value={formData.ville} onChange={e => setFormData({...formData, ville: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Quartier *</label>
                                <input required className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-xl md:rounded-[1.5rem] px-5 py-4 md:px-6 md:py-5 text-sm md:text-base font-black dark:text-white shadow-sm transition-all" value={formData.quartier} onChange={e => setFormData({...formData, quartier: e.target.value})} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Pays</label>
                            <input readOnly className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl md:rounded-[1.5rem] px-5 py-4 md:px-6 md:py-5 text-sm md:text-base font-black text-slate-400 shadow-inner" value={formData.pays} />
                        </div>

                        <div className="space-y-4 pt-4">
                          <motion.button 
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-5 md:py-7 rounded-2xl md:rounded-[2.5rem] font-black text-sm md:text-lg uppercase tracking-[0.2em] shadow-xl transition-all duration-500 active:scale-95 flex items-center justify-center gap-3 md:gap-4 ${formData.type_profil === 'pro' ? 'bg-brand-orange text-white shadow-orange-600/20' : 'bg-emerald-600 text-white shadow-emerald-600/20'}`}
                          >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Valider mon Inscription <ArrowRight className="w-5 h-5" /></>}
                          </motion.button>
                          <motion.button 
                            whileHover={{ x: -5 }}
                            type="button" 
                            onClick={() => setStep('phone')} 
                            className="w-full text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-center hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <ChevronLeft className="w-4 h-4" /> Retour à l'identification
                          </motion.button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-12 md:py-24 space-y-8 md:space-y-12"
                  >
                    <div className="relative">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                        className="w-24 h-24 md:w-32 md:h-32 bg-emerald-600 rounded-full md:rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-600/40"
                      >
                          <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-white" />
                      </motion.div>
                      <motion.div 
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-emerald-400 rounded-full md:rounded-[3rem] -z-10"
                      />
                    </div>
                    <div className="space-y-4 md:space-y-6">
                      <h2 className="text-3xl md:text-[3rem] font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Authentification Réussie</h2>
                      <p className="text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] md:text-[12px] tracking-[0.2em] md:tracking-[0.4em]">Accès en cours de sécurisation...</p>
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

export default AuthModal;
