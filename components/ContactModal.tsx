import React, { useState } from 'react';
import { X, CheckCircle2, Loader2, Phone, Mail, User, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../db';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      db.addMessage({
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        message: formData.message || "Demande de conseil gratuit depuis le Hero"
      });
      setIsSubmitting(false);
      setIsSuccess(true);

      // Auto-close after 3 seconds as requested
      setTimeout(() => {
        onClose();
        // Reset states for next time
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({ nom: '', email: '', telephone: '', message: '' });
        }, 300);
      }, 3000);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-8">
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
            className="relative bg-white dark:bg-slate-900 w-full max-w-lg sm:rounded-[4rem] overflow-hidden shadow-[0_64px_128px_-24px_rgba(0,0,0,0.5)] border-none md:border md:border-slate-800"
          >
            <div className="p-10 md:p-16">
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose} 
                className="absolute top-10 right-10 p-4 bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] z-10 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group"
              >
                <X className="w-7 h-7 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
              </motion.button>

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-12"
                  >
                    <div>
                      <h2 className="text-[2.5rem] md:text-[3rem] font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Conseil Gratuit</h2>
                      <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium text-lg">Laissez vos coordonnées, un expert Sunwave vous rappelle dans l'heure.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Nom Complet</label>
                        <div className="relative group">
                          <User className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                          <input 
                            required
                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-[2rem] pl-20 pr-8 py-6 text-base font-black transition-all dark:text-white shadow-sm"
                            value={formData.nom}
                            onChange={e => setFormData({...formData, nom: e.target.value})}
                            placeholder="Ex: Jean Kouassi"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Téléphone</label>
                        <div className="relative group">
                          <Phone className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                          <input 
                            type="tel"
                            required
                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-[2rem] pl-20 pr-8 py-6 text-base font-black transition-all dark:text-white shadow-sm"
                            value={formData.telephone}
                            onChange={e => setFormData({...formData, telephone: e.target.value})}
                            placeholder="Ex: 07 00 00 00 00"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Email</label>
                        <div className="relative group">
                          <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                          <input 
                            type="email"
                            required
                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-[2rem] pl-20 pr-8 py-6 text-base font-black transition-all dark:text-white shadow-sm"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            placeholder="votre@email.com"
                          />
                        </div>
                      </div>

                      <motion.button 
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-7 bg-emerald-600 text-white rounded-[2.5rem] font-black text-xl uppercase tracking-[0.3em] flex items-center justify-center gap-5 hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20 disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <>Envoyer ma demande <Send className="w-6 h-6" /></>}
                      </motion.button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-10"
                  >
                    <div className="relative inline-block">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                        className="w-28 h-28 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-600/40"
                      >
                        <CheckCircle2 className="w-14 h-14 text-white" />
                      </motion.div>
                      <motion.div 
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-emerald-400 rounded-[2.5rem] -z-10"
                      />
                    </div>
                    <div className="space-y-6">
                      <h2 className="text-[2.5rem] font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Demande Envoyée !</h2>
                      <p className="text-lg text-slate-500 dark:text-slate-400 px-6 font-medium leading-relaxed">
                        Merci ! Un expert Sunwave va analyser vos besoins et vous recontacter très prochainement pour votre conseil gratuit.
                      </p>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose} 
                      className="px-12 py-6 bg-slate-950 dark:bg-white dark:text-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl"
                    >
                      D'accord
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Toast Message */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: 20, x: '-50%' }}
                  className="absolute bottom-12 left-1/2 z-[110] bg-emerald-600 text-white px-10 py-5 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl flex items-center gap-5 whitespace-nowrap border border-white/20"
                >
                  <CheckCircle2 className="w-7 h-7" />
                  Message envoyé avec succès !
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
