import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle2, MessageSquare, Clock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../db';
import { WHATSAPP_CONFIG } from '../constants';

interface ContactSectionProps {
  onBack?: () => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({ onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: 'Partenariat',
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
        message: `[${formData.sujet}] ${formData.message}`
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ nom: '', email: '', telephone: '', sujet: 'Partenariat', message: '' });
    }, 1500);
  };

  return (
    <section id="contact" className="py-32 md:py-48 bg-white dark:bg-slate-950 scroll-mt-24">
      <div className="container mx-auto px-6 md:px-12">
        {onBack && (
          <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="mb-12 flex items-center gap-3 text-slate-500 hover:text-emerald-600 transition-colors font-black uppercase tracking-[0.2em] text-[11px]"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </motion.button>
        )}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-20 items-start">
            
            {/* Infos de contact */}
            <div className="space-y-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20 mb-8">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Contact & Support</span>
                </div>
                <h2 className="text-[3rem] md:text-[4.5rem] font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tighter leading-[0.95]">Espace Dédié <br /><span className="text-emerald-600">Contact</span></h2>
                <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Vous avez une question sur nos solutions, une demande de partenariat ou besoin d'une assistance technique ? Notre équipe d'experts est à votre écoute.
                </p>
              </motion.div>

              <div className="space-y-8">
                {[
                  {
                    icon: MessageSquare,
                    color: 'emerald',
                    title: 'Support WhatsApp (Priorité CI)',
                    desc: 'Réponse rapide par nos conseillers locaux.',
                    content: (
                      <div className="flex flex-wrap gap-3 mt-4">
                        <motion.a whileHover={{ scale: 1.05 }} href={WHATSAPP_CONFIG.CI.link} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg">WhatsApp CI: {WHATSAPP_CONFIG.CI.display}</motion.a>
                        <motion.a whileHover={{ scale: 1.05 }} href={WHATSAPP_CONFIG.ML.link} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg">Mali: {WHATSAPP_CONFIG.ML.display}</motion.a>
                      </div>
                    )
                  },
                  {
                    icon: Clock,
                    color: 'blue',
                    title: 'Horaires d\'Ouverture',
                    desc: 'Lundi - Vendredi : 08h00 - 18h00',
                    content: <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-widest">Samedi : 09h00 - 13h00</p>
                  },
                  {
                    icon: ShieldCheck,
                    color: 'amber',
                    title: 'Siège Social',
                    desc: 'Abidjan, Cocody Riviera Palmeraie',
                    content: <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-widest">Immeuble EL-KEYON, 2ème étage</p>
                  },
                  {
                    icon: Mail,
                    color: 'indigo',
                    title: 'Email Professionnel',
                    desc: 'Pour vos demandes officielles et partenariats.',
                    content: <a href="mailto:Sunwavehybrid@gmail.com" className="text-xs text-indigo-600 dark:text-indigo-400 font-black mt-1 uppercase tracking-widest hover:underline">Sunwavehybrid@gmail.com</a>
                  }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-6 p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 group"
                  >
                    <div className={`w-14 h-14 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-7 h-7 text-${item.color}-600`} />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
                      {item.content}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Formulaire */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-slate-50 dark:bg-slate-900 p-10 md:p-16 rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, zoom: 0.9 }}
                    animate={{ opacity: 1, zoom: 1 }}
                    exit={{ opacity: 0, zoom: 0.9 }}
                    className="h-full flex flex-col items-center justify-center text-center py-12 space-y-8"
                  >
                    <div className="w-24 h-24 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-[2.5rem] font-black text-slate-900 dark:text-white uppercase tracking-tighter">Message Envoyé !</h3>
                      <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">Merci pour votre confiance. Un expert Sunwave vous répondra sous 24h.</p>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsSuccess(false)}
                      className="px-10 py-5 bg-slate-950 dark:bg-white dark:text-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl"
                    >
                      Envoyer un autre message
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-8"
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Nom Complet</label>
                        <input 
                          required
                          className="w-full bg-white dark:bg-slate-950 border-2 border-transparent rounded-[2rem] px-8 py-5 text-base font-medium focus:ring-0 focus:border-emerald-500 dark:text-white shadow-sm transition-all"
                          value={formData.nom}
                          onChange={e => setFormData({...formData, nom: e.target.value})}
                          placeholder="Ex: Jean Kouassi"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Téléphone</label>
                        <input 
                          type="tel"
                          required
                          className="w-full bg-white dark:bg-slate-950 border-2 border-transparent rounded-[2rem] px-8 py-5 text-base font-medium focus:ring-0 focus:border-emerald-500 dark:text-white shadow-sm transition-all"
                          value={formData.telephone}
                          onChange={e => setFormData({...formData, telephone: e.target.value})}
                          placeholder="Ex: 07 00 00 00 00"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Email</label>
                        <input 
                          type="email"
                          required
                          className="w-full bg-white dark:bg-slate-950 border-2 border-transparent rounded-[2rem] px-8 py-5 text-base font-medium focus:ring-0 focus:border-emerald-500 dark:text-white shadow-sm transition-all"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="votre@email.com"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Sujet</label>
                        <div className="relative">
                          <select 
                            className="w-full bg-white dark:bg-slate-950 border-2 border-transparent rounded-[2rem] px-8 py-5 text-base font-medium focus:ring-0 focus:border-emerald-500 dark:text-white shadow-sm appearance-none transition-all"
                            value={formData.sujet}
                            onChange={e => setFormData({...formData, sujet: e.target.value})}
                          >
                            <option value="Partenariat">Devenir Partenaire</option>
                            <option value="Devis">Demande de Devis</option>
                            <option value="SAV">Support Technique / SAV</option>
                            <option value="Autre">Autre demande</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Votre Message</label>
                      <textarea 
                        required
                        rows={5}
                        className="w-full bg-white dark:bg-slate-950 border-2 border-transparent rounded-[3rem] px-8 py-6 text-base font-medium focus:ring-0 focus:border-emerald-500 dark:text-white shadow-sm resize-none transition-all"
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        placeholder="Comment pouvons-nous vous aider ?"
                      />
                    </div>

                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.25em] flex items-center justify-center gap-4 hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="w-7 h-7 animate-spin" /> : <>Envoyer le Message <Send className="w-5 h-5" /></>}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
