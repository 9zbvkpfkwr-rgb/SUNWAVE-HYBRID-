
import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, User as UserIcon, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WHATSAPP_CONFIG } from '../constants';
import Logo from './Logo';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  currentView: string;
  onOpenAuth: () => void;
  onNavigateToSection: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentView, onOpenAuth, onNavigateToSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ['savings-calculator', 'advantages', 'packs-grid', 'packs', 'simulator', 'blog', 'partners', 'contact', 'testimonials'];
      
      // Find the section that is currently most visible in the viewport
      let current = 'home';
      let maxVisibleHeight = 0;
      const viewportHeight = window.innerHeight;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
          
          if (visibleHeight > maxVisibleHeight && visibleHeight > 100) {
            maxVisibleHeight = visibleHeight;
            current = section;
          }
        }
      }

      if (window.scrollY < 100) {
        setActiveSection('home');
      } else {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleSectionClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    onNavigateToSection(id);
    if (window.navigator.vibrate) window.navigator.vibrate(5);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-500 ${
      scrolled 
      ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl h-16 border-b border-slate-200/50 dark:border-slate-800' 
      : 'bg-transparent h-24'
    }`}>
      <div className="container mx-auto px-4 h-full flex items-center justify-between relative z-50">
        <motion.a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onNavigateToSection('home'); }} 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Logo className={scrolled ? 'scale-90' : 'scale-110'} />
        </motion.a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-6 mr-4">
            {[
              { id: 'advantages', label: 'Avantages' },
              { id: 'packs-grid', label: 'Nos Packs' },
              { id: 'packs', label: 'Catalogue' },
              { id: 'simulator', label: 'Économies' },
              { id: 'blog', label: 'Blog' },
              { id: 'partners', label: 'Partenaires' },
              { id: 'contact', label: 'Contact' }
            ].map((item) => (
              <motion.a 
                key={item.id}
                href={`#${item.id}`} 
                onClick={(e) => handleSectionClick(e, item.id)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative rounded-xl group ${
                  (currentView === 'contact' && item.id === 'contact') || (currentView === 'landing' && activeSection === item.id)
                  ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-emerald-600 transition-all duration-500 rounded-full ${((currentView === 'contact' && item.id === 'contact') || (currentView === 'landing' && activeSection === item.id)) ? 'w-4' : 'w-0 group-hover:w-2'}`}></span>
              </motion.a>
            ))}
          </div>
          
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
            <motion.button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:scale-110 transition-all active:rotate-12"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, rotate: 15 }}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            <motion.button 
              onClick={() => { onOpenAuth(); if(window.navigator.vibrate) window.navigator.vibrate(10); }}
              className="relative flex items-center gap-2 px-4 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all shadow-xl active:scale-95"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {user ? <LayoutDashboard className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
              {user ? 'Mon Espace' : 'Compte'}
            </motion.button>
            
            <div className="flex flex-col gap-1">
              <motion.a 
                href={WHATSAPP_CONFIG.CI.link}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all"
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🇨🇮</span>
                {WHATSAPP_CONFIG.CI.display}
              </motion.a>
              <motion.a 
                href={WHATSAPP_CONFIG.ML.link}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all"
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🇲🇱</span>
                {WHATSAPP_CONFIG.ML.display}
              </motion.a>
            </div>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
            <motion.button 
              onClick={toggleDarkMode} 
              className="p-2 text-slate-500"
              whileTap={{ scale: 0.9, rotate: 15 }}
            >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            <motion.button 
              className="p-2 text-slate-600 dark:text-slate-300" 
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.9 }}
            >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </motion.button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div 
        className={`md:hidden fixed left-0 w-full z-[9998] transition-all duration-500 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
        }`}
        style={{
            top: scrolled ? '64px' : '96px',
            backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.99)' : 'rgba(255, 255, 255, 0.99)',
            borderTop: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div className="flex flex-col h-full pt-6 pb-10 px-6 overflow-y-auto">
            <div className="flex-1 flex flex-col gap-2">
            {[
              { id: 'advantages', label: 'Avantages' },
              { id: 'packs-grid', label: 'Nos Packs' },
              { id: 'packs', label: 'Catalogue' },
              { id: 'simulator', label: 'Économie' },
              { id: 'blog', label: 'Blog' },
              { id: 'partners', label: 'Partenaires' },
              { id: 'contact', label: 'Contact' }
            ].map((item, idx) => (
              <motion.a 
                key={item.id} 
                href={`#${item.id}`} 
                onClick={(e) => handleSectionClick(e, item.id)} 
                className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border border-transparent ${
                  (currentView === 'contact' && item.id === 'contact') || (currentView === 'landing' && activeSection === item.id)
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-500/20' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: idx * 0.05 }}
                whileTap={{ scale: 0.98 }}
              >
                  <span className={`text-xl font-black uppercase tracking-tight ${
                    (currentView === 'contact' && item.id === 'contact') || (currentView === 'landing' && activeSection === item.id)
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-900 dark:text-white'
                  }`}>{item.label}</span>
                  
                  {((currentView === 'contact' && item.id === 'contact') || (currentView === 'landing' && activeSection === item.id)) && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                    />
                  )}
              </motion.a>
            ))}

            <motion.button 
              onClick={() => { setIsOpen(false); onOpenAuth(); }} 
              className="group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border border-transparent hover:bg-slate-50 dark:hover:bg-slate-900 mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4 }}
              whileTap={{ scale: 0.98 }}
            >
                <span className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  {user ? 'Tableau de bord' : 'Connexion'}
                </span>
                {user ? <LayoutDashboard className="w-5 h-5 text-slate-400" /> : <UserIcon className="w-5 h-5 text-slate-400" />}
            </motion.button>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-2 gap-3">
                  <motion.a 
                    href={WHATSAPP_CONFIG.CI.link} 
                    className="py-4 bg-emerald-600 text-white text-center rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-lg">🇨🇮</span> Côte d'Ivoire
                  </motion.a>
                  <motion.a 
                    href={WHATSAPP_CONFIG.ML.link} 
                    className="py-4 bg-emerald-800 text-white text-center rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-800/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.6 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-lg">🇲🇱</span> Mali
                  </motion.a>
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
