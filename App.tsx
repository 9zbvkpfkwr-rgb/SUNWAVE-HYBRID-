
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Hero from './components/Hero';
import Simulators from './components/Simulators';
import ProductCard from './components/ProductCard';
import CatalogSection from './components/CatalogSection';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import OrderModal from './components/OrderModal';
import AuthModal from './components/AuthModal';
import ClientDashboard from './components/ClientDashboard';
import AdminDashboard from './components/AdminDashboard';
import ChatBot from './components/ChatBot';
import ComparisonBar from './components/ComparisonBar';
import ComparisonModal from './components/ComparisonModal';
import BlogSection from './components/BlogSection';
import PartnersSection from './components/PartnersSection';
import ContactSection from './components/ContactSection';
import { SUNWAVE_PACKS } from './constants';
import { Product } from './types';
import { Zap, ShieldCheck, TrendingDown, Battery } from 'lucide-react';
import { db } from './db';

import ConfidentialitePage from './components/ConfidentialitePage';

// Application of requested changes - v2
const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'dashboard' | 'admin' | 'privacy' | 'contact'>('landing');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTrigger, setAuthTrigger] = useState<{message: string, action: () => void} | null>(null);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<Product | null>(null);
  const [orderContextForChat, setOrderContextForChat] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [comparisonItems, setComparisonItems] = useState<Product[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  useEffect(() => {
    const user = db.getCurrentUser();
    setCurrentUser(user);
    if (user?.role === 'admin') setView('admin');
    else if (user) setView('dashboard');
  }, []);

  const toggleComparison = (pack: Product) => {
    setComparisonItems(prev => {
      const exists = prev.find(p => p.id === pack.id);
      if (exists) return prev.filter(p => p.id !== pack.id);
      if (prev.length >= 2) {
        // Retire le plus ancien (le premier de la liste) et ajoute le nouveau
        return [prev[1], pack];
      }
      return [...prev, pack];
    });
  };

  const startOrderFlow = (pack: Product, simulatorData?: any) => {
    const user = db.getCurrentUser();
    const context = {
      productName: pack.name,
      productId: pack.id,
      price: pack.price,
      acompte: pack.acompte,
      ...simulatorData
    };

    if (!user) {
      setAuthTrigger({
        message: "L'identification est requise pour démarrer le diagnostic et la commande.",
        action: () => {
          setSelectedProductForOrder(pack);
          setOrderContextForChat(context);
        }
      });
      setIsAuthOpen(true);
    } else {
      setSelectedProductForOrder(pack);
      setOrderContextForChat(context);
    }
  };

  const handleRedirectToChat = (context: any) => {
    // Fusionner les données de commande finales avec le contexte simulateur existant
    setOrderContextForChat(prev => ({ ...prev, ...context }));
    setIsChatOpen(true);
  };

  const handleLogout = () => {
    db.logout();
    setCurrentUser(null);
    setView('landing');
    setOrderContextForChat(null);
    setIsChatOpen(false);
  };

  const navigateToSection = (id: string) => {
    if (id === 'contact') {
      setView('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (id === 'packs' || id === 'catalog' || id === 'catalogue-section') {
      setIsCatalogOpen(true);
    }
    setView('landing');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 100);
  };

  const onAuthSuccess = () => {
    const user = db.getCurrentUser();
    setCurrentUser(user);
    if (user?.role === 'admin') setView('admin');
    else if (user) {
       if (authTrigger?.action) authTrigger.action();
       else setView('dashboard');
    }
    setAuthTrigger(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 pt-24">
      <Header user={currentUser} currentView={view} onOpenAuth={() => {
          const user = db.getCurrentUser();
          if (user?.role === 'admin') setView('admin');
          else if (user) setView('dashboard');
          else setIsAuthOpen(true);
        }} onNavigateToSection={navigateToSection} />
      
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.main
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onOpenContact={() => setView('contact')} onOpenChat={() => setIsChatOpen(true)} />
            
            <motion.section 
              id="advantages" 
              className="py-16 md:py-24"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
            >
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {[
                  { icon: <TrendingDown className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />, title: "Jusqu'à 40% de gains", desc: "Réduisez intelligemment vos factures d'électricité" },
                  { icon: <Battery className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />, title: "Résiste aux Températures", desc: "Matériel certifié pour le climat sahélien et tropical." },
                  { icon: <Zap className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />, title: "Continuité de Service", desc: "Le délestage ne sera plus qu'un lointain souvenir 24h/24." },
                  { icon: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />, title: "Maintenance & Proximité", desc: "Sérénité garantie par un SAV physique dans votre pays." }
                ].map((feature, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                    }}
                    whileHover={{ y: -5 }}
                    className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all hover:dark:border-white/20"
                  >
                    <div className="mb-4 md:mb-6 bg-slate-50 dark:bg-slate-800/50 w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center border border-transparent dark:border-white/5">{feature.icon}</div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 dark:text-white">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section 
            id="packs-grid" 
            className="py-16 md:py-24 bg-white dark:bg-slate-900"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-6">Nos Packs Solaire</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Des solutions complètes et prêtes à l'emploi pour tous vos besoins énergétiques.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {SUNWAVE_PACKS.map((pack) => (
                  <ProductCard 
                    key={pack.id} 
                    pack={pack} 
                    onCompare={toggleComparison} 
                    onOrder={startOrderFlow}
                    isComparing={comparisonItems.some(i => i.id === pack.id)}
                  />
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section 
            id="packs" 
            className="py-16 md:py-24 bg-slate-200/30 dark:bg-slate-900/20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-center">
                <div className="w-full">
                  <CatalogSection onOrder={startOrderFlow} isOpen={isCatalogOpen} />
                </div>
                
                <motion.button 
                  onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                  className="flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-[#2E7D32] text-white rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl hover:bg-[#1b5e20] transition-all mt-8 md:mt-12"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCatalogOpen ? 'Masquer le catalogue' : 'Voir tout le catalogue'} <TrendingDown className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-transform ${isCatalogOpen ? 'rotate-180' : ''}`} />
                </motion.button>
              </div>
            </div>
          </motion.section>

          <Simulators 
            onOrder={startOrderFlow} 
            onCompare={toggleComparison} 
            onOpenComparison={() => setIsComparisonModalOpen(true)} 
            comparisonItems={comparisonItems}
          />
          <BlogSection />
          <PartnersSection onContact={() => setView('contact')} />
          <Testimonials />
          
          <ComparisonBar 
            items={comparisonItems} 
            onRemove={(id) => setComparisonItems(prev => prev.filter(p => p.id !== id))}
            onClear={() => setComparisonItems([])}
            onOpenComparison={() => setIsComparisonModalOpen(true)}
          />

          <ComparisonModal 
            isOpen={isComparisonModalOpen} 
            onClose={() => setIsComparisonModalOpen(false)} 
            items={comparisonItems} 
          />
        </motion.main>
      )}

      {view === 'privacy' && (
        <motion.div
          key="privacy"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <ConfidentialitePage onBack={() => setView('landing')} />
        </motion.div>
      )}

      {view === 'dashboard' && currentUser && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <ClientDashboard user={currentUser} onLogout={handleLogout} onNavigateToCatalog={() => navigateToSection('catalogue-section')} />
        </motion.div>
      )}
      
      {view === 'admin' && (
        <motion.div
          key="admin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AdminDashboard onLogout={handleLogout} />
        </motion.div>
      )}

      {view === 'contact' && (
        <motion.div
          key="contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="pt-24"
        >
          <ContactSection onBack={() => setView('landing')} />
        </motion.div>
      )}
    </AnimatePresence>

    {view !== 'admin' && (
      <div className="dark">
        <Footer onNavigateToPrivacy={() => setView('privacy')} onNavigateToSection={navigateToSection} />
      </div>
    )}

      <OrderModal isOpen={!!selectedProductForOrder} onClose={() => setSelectedProductForOrder(null)} product={selectedProductForOrder} onRedirectToChat={handleRedirectToChat} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={onAuthSuccess} initialMessage={authTrigger?.message} />
      <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} user={currentUser} orderContext={orderContextForChat} onOpenAuth={() => setIsAuthOpen(true)} />
    </div>
  );
};

export default App;
