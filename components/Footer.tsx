import React from 'react';
import { Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';
import { WHATSAPP_CONFIG } from '../constants';
import Logo from './Logo';

interface FooterProps {
  onNavigateToPrivacy?: () => void;
  onNavigateToSection?: (id: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateToPrivacy, onNavigateToSection }) => {
  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onNavigateToSection?.(id);
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 md:pt-32 pb-10 md:pb-16 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] gap-12 md:gap-20 mb-12 md:mb-24 pb-12 md:pb-24 border-b border-white/5 text-center md:text-left">
          <div className="space-y-8 md:space-y-10 flex flex-col items-center md:items-start">
            <motion.a 
              href="/" 
              whileHover={{ scale: 0.98 }}
              className="inline-block" 
              onClick={(e) => { e.preventDefault(); onNavigateToSection?.('home'); }}
            >
              <Logo />
            </motion.a>
            <p className="text-slate-400 max-w-md leading-relaxed text-base md:text-lg font-medium mx-auto md:mx-0">
              L'énergie hybride intelligente pour la Côte d'Ivoire, le Mali, le Burkina Faso, le Sénégal et la Guinée. Batteries Lithium haute performance, durables et accessibles.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              {[
                { icon: Instagram, color: 'hover:bg-pink-600' },
                { icon: Facebook, color: 'hover:bg-blue-600' },
                { icon: Twitter, color: 'hover:bg-sky-500' },
                { icon: Linkedin, color: 'hover:bg-blue-700' }
              ].map((social, idx) => (
                <motion.a 
                  key={idx}
                  href="#" 
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-all duration-300 text-slate-400 hover:text-white ${social.color} shadow-xl`}
                >
                  <social.icon className="w-4 h-4 md:w-5 md:h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[10px] md:text-[11px] font-black mb-8 md:mb-10 uppercase tracking-[0.3em] text-slate-500">Nos Secteurs</h4>
            <ul className="space-y-4 md:space-y-5 text-slate-400 text-sm md:text-base font-medium">
              {[
                'Abidjan (Cocody, Riviera)', 
                'Bingerville & Yamoussoukro', 
                'Bamako (ACI 2000)', 
                'Dakar (Plateau, Almadies)',
                'Conakry (Kindia, Labé)',
                'Ouagadougou (Bobo)',
                'Korhogo & San Pedro'
              ].map((loc, idx) => (
                <motion.li 
                  key={idx} 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 group cursor-default justify-center md:justify-start"
                >
                  <MapPin className="w-4 h-4 text-emerald-500 group-hover:scale-125 transition-transform" /> 
                  <span className="group-hover:text-white transition-colors">{loc}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[10px] md:text-[11px] font-black mb-8 md:mb-10 uppercase tracking-[0.3em] text-slate-500">Contacts SAV 24/7</h4>
            <div className="space-y-4 md:space-y-6 w-full max-w-xs md:max-w-none">
              {[
                { cfg: WHATSAPP_CONFIG.CI, label: "Côte d'Ivoire", flag: "🇨🇮", color: "text-emerald-500", showNumber: true },
                { cfg: WHATSAPP_CONFIG.ML, label: "Mali", flag: "🇲🇱", color: "text-emerald-400", showNumber: true },
                { cfg: WHATSAPP_CONFIG.BF, label: "Burkina Faso", flag: "🇧🇫", color: "text-brand-orange", showNumber: false },
                { cfg: WHATSAPP_CONFIG.SN, label: "Sénégal", flag: "🇸🇳", color: "text-blue-500", showNumber: false },
                { cfg: WHATSAPP_CONFIG.GN, label: "Guinée", flag: "🇬🇳", color: "text-blue-400", showNumber: false }
              ].map((item, idx) => (
                <motion.a 
                  key={idx} 
                  href={item.cfg.link} 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 group bg-white/5 md:bg-transparent p-3 md:p-0 rounded-2xl md:rounded-none hover:bg-white/10 md:hover:bg-transparent transition-all"
                >
                  <div className="bg-white/5 p-2 rounded-xl group-hover:bg-white/10 transition-all shadow-lg">
                    <span className="text-xl">{item.flag}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] leading-none mb-1.5">{item.label}</p>
                    {item.showNumber && (
                      <span className={`font-black text-sm md:text-base text-white group-hover:${item.color} transition-colors tracking-tight`}>
                        {item.cfg.display}
                      </span>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 md:gap-10 text-[10px] md:text-[11px] text-slate-500 uppercase tracking-[0.2em] font-black text-center lg:text-left">
          <div className="space-y-2">
            <p>© 2026 SUNWAVE HYBRID.</p>
            <p className="text-slate-600">Un produit et propriété de EL-KEYON Sarl.</p>
            <p className="text-slate-600 lowercase tracking-normal font-medium">Email: Sunwavehybrid@gmail.com</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {[
              { label: 'Blog', id: 'blog' },
              { label: 'Confidentialité', action: onNavigateToPrivacy },
              { label: 'Support technique', id: 'contact' }
            ].map((link, idx) => (
              <a 
                key={idx}
                href={link.id ? `#${link.id}` : '#'} 
                onClick={(e) => {
                  if (link.id) handleLinkClick(e, link.id);
                  else { e.preventDefault(); link.action?.(); }
                }}
                className="text-white hover:text-emerald-500 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-emerald-500 group-hover:w-full transition-all duration-500" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
