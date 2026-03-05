
import React, { useEffect, useState } from 'react';
import { ArrowRight, Zap, Star, Shield, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

interface HeroProps {
  onOpenContact: () => void;
  onOpenChat: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenContact, onOpenChat }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAction = (callback: () => void) => {
    if (window.navigator.vibrate) window.navigator.vibrate(15);
    callback();
  };

  return (
    <section className="relative pt-6 md:pt-10 lg:pt-16 pb-24 md:pb-40 overflow-hidden min-h-0 flex items-center">
      {/* Background Shapes for Parallax */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-20 right-[10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-20 left-[5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-brand-orange/5 rounded-full blur-[100px] -z-10"
      />
      
      <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-[1.2fr_0.8fr] gap-16 md:gap-24 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 md:space-y-12"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl px-5 py-2.5 rounded-full text-emerald-600 dark:text-emerald-400 font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] border border-emerald-500/20 shadow-xl shadow-emerald-500/5"
          >
            <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span className="hidden xs:inline">PACK STARTER DÈS 68 000 FCFA / MOIS !</span>
            <span className="xs:hidden">DÈS 68 000 FCFA</span>
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-[7.5rem] font-black leading-[0.9] md:leading-[0.85] text-slate-900 dark:text-white tracking-tight uppercase font-display">
              Prenez le <br />
              <span className="text-emerald-600 inline-block relative">
                contrôle
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 1 }}
                  className="absolute bottom-2 left-0 h-2 md:h-4 bg-emerald-500/20 -z-10"
                />
              </span> <br />
              de l'énergie.
            </h1>
          </div>
          
          <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl font-medium">
            L'énergie solaire pour tous. Formules accessibles dès <span className="text-emerald-600 font-bold">68 000 FCFA</span>. Batteries Lithium certifiées et garantie de 3 à 7 ans.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-6">
            <motion.button 
              onClick={() => handleAction(() => {
                const el = document.getElementById('packs-grid');
                if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
              })}
              className="w-full sm:w-auto px-8 md:px-14 py-5 md:py-7 bg-slate-950 dark:bg-white dark:text-slate-950 text-white rounded-2xl font-bold text-xs md:text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white transition-all duration-500 group shadow-2xl shadow-slate-950/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Découvrir les Packs
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </motion.button>
            <motion.button 
              onClick={() => handleAction(onOpenChat)}
              className="w-full sm:w-auto px-8 md:px-14 py-5 md:py-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-950 dark:text-white rounded-2xl font-bold text-xs md:text-sm uppercase tracking-[0.2em] flex items-center justify-center hover:border-emerald-600 transition-all duration-500 shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Devis Gratuit
            </motion.button>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-3 gap-8 md:gap-16 pt-12 md:pt-16 border-t border-slate-200 dark:border-slate-800">
            {[
              { val: "500+", label: "Installés", icon: Shield },
              { val: "100%", label: "Écolo", icon: Sparkles },
              { val: "-45%", label: "Économies", icon: Zap }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <stat.icon className="w-4 h-4 text-emerald-600" />
                  <p className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight font-display">{stat.val}</p>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-[13px] md:text-[15px] text-slate-400 dark:text-slate-500 italic font-medium max-w-xl leading-relaxed border-l-2 border-emerald-500/30 pl-4"
          >
            "Si la première vague a montré qu'il est possible de faire des transferts à 1 FCFA, nous sommes là pour prouver qu'il est possible de casser le poids des factures d'électricité dans vos portefeuilles. Djidjii même !!"
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative group lg:block hidden"
        >
            {/* Effet de lueur en arrière-plan */}
            <div className="absolute inset-0 bg-emerald-600/20 rounded-[4rem] blur-[120px] group-hover:scale-110 transition-transform duration-1000"></div>
            
            {/* Container Principal Unifié */}
            <div className="relative w-full aspect-[4/5] bg-slate-200 dark:bg-slate-800 rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] transition-all duration-700 group-hover:shadow-emerald-500/10 border border-white/20 dark:border-white/5">
                
                {/* Image Produit Haute Définition */}
                <img 
                    src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop" 
                    alt="Technologie Sunwave Premium" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]"
                />

                {/* Overlay Gradient Premium pour Lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>

                {/* Informations Unifiées à l'intérieur du container */}
                <div className="absolute bottom-0 left-0 w-full p-12 flex flex-col items-start gap-6">
                  
                  {/* Badge Premium */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 px-5 py-2.5 bg-emerald-600 text-white rounded-full shadow-2xl border border-white/20 backdrop-blur-md"
                  >
                    <Zap className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-[12px] font-bold uppercase tracking-[0.15em]">Technologie Premium</span>
                  </motion.div>
                  
                  {/* Groupe de prix et titre */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-[56px] md:text-[72px] font-black text-white tracking-tighter leading-none font-display">68k F</span>
                      <span className="text-[16px] font-bold text-emerald-400 uppercase tracking-[0.3em]">CFA / MOIS</span>
                    </div>
                    <p className="text-[16px] md:text-[18px] font-bold text-white/90 uppercase tracking-[0.3em] leading-tight flex items-center gap-3">
                      <span className="w-8 h-[2px] bg-emerald-500"></span>
                      Pack Starter
                    </p>
                  </div>
                </div>
            </div>

            {/* Floating Card Detail */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -right-10 top-1/4 glass p-6 rounded-3xl shadow-2xl z-10 hidden xl:block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-emerald-600 fill-current" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Satisfaction</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white font-display">4.9/5.0</p>
                </div>
              </div>
            </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
