
import React, { useMemo } from 'react';
import { db } from '../db';
import { User, InstallationPhase } from '../types';
import { Package, Zap, LogOut, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ClientDashboardProps {
  user: User;
  onLogout: () => void;
  onNavigateToCatalog: () => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ user, onLogout, onNavigateToCatalog }) => {
  const orders = useMemo(() => db.getUserOrders(user.id), [user.id]);
  const activeOrder = useMemo(() => orders.find(o => o.statut !== 'annule'), [orders]);
  const currency = user.pays === "Guinée" ? "GNF" : "F CFA";

  const phases: {id: InstallationPhase, label: string, desc: string}[] = [
    { id: 1, label: "Validation & Séquestre", desc: "Acompte sécurisé en attente de vérification." },
    { id: 2, label: "Étude Technique", desc: "Diagnostic terrain et préparation du kit." },
    { id: 3, label: "Installation & Mise en service", desc: "Pose et activation de votre système." }
  ];

  const currentPhase = activeOrder?.phase || 1;

  const handleNavigateToCatalog = () => {
    onNavigateToCatalog();
    setTimeout(() => {
      document.getElementById('catalogue-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-24 pb-20 transition-colors duration-500">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header Profil */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.3)] mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">{user.prenom[0]}</div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Mon Espace Solaire</h1>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{user.prenom} {user.nom} • {user.pays}</p>
              </div>
           </div>
           <button onClick={onLogout} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
             <LogOut className="w-4 h-4" /> Déconnexion
           </button>
        </div>

        {activeOrder?.statut === 'termine' || activeOrder?.archived ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[40px] border border-slate-200 dark:border-white/10 shadow-xl text-center space-y-8 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Félicitations {user.prenom} !</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                Toute l'équipe Sunwave Hybrid vous félicite pour la clôture de votre dossier. Nous vous souhaitons une excellente continuation avec votre nouveau système énergétique intelligent.
              </p>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-white/5 max-w-xl mx-auto">
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Besoin de maintenance ?</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Nous pouvons continuer d'assurer la maintenance de votre installation. Un contrat de maintenance de 12 mois renouvelable peut vous être adressé par mail. Parlez-en à notre assistant IA !
                </p>
              </div>
            </div>
          </div>
        ) : activeOrder ? (
          <div className="space-y-8">
            {/* Suivi Phase */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between mb-10">
                <h3 className="font-black uppercase tracking-tight text-slate-900 dark:text-white">Suivi de votre installation</h3>
                <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">Phase {currentPhase}/3</span>
              </div>
              
              <div className="space-y-6">
                {phases.map((phase) => (
                  <div key={phase.id} className={`flex items-start gap-6 p-6 rounded-3xl transition-all ${currentPhase === phase.id ? 'bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-500/20' : 'opacity-50'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${currentPhase >= phase.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {currentPhase > phase.id ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-black">{phase.id}</span>}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-900 dark:text-white uppercase text-sm mb-1">{phase.label}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{phase.desc}</p>
                      
                      {phase.id === 3 && currentPhase >= 2 && (
                        <div className="mt-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-emerald-500/10">
                           <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Délai d'exécution</p>
                           <p className="text-[11px] text-slate-600 dark:text-slate-300">Installation prévue sous 35 jours après validation de l'acompte.</p>
                           {activeOrder.installation_date && (
                             <div className="mt-3 pt-3 border-t border-emerald-500/10">
                               <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Passage des équipes</p>
                               <p className="text-xs font-bold text-slate-900 dark:text-white">{activeOrder.installation_date}</p>
                             </div>
                           )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Infos Pack */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-900 p-10 rounded-[40px] text-white relative overflow-hidden">
                <Zap className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12" />
                <p className="text-[10px] font-black uppercase text-emerald-400 mb-2">Votre Système</p>
                <h2 className="text-3xl font-black mb-6 tracking-tighter">Pack {db.getProductById(activeOrder.produit_id)?.gamme}</h2>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="opacity-60">Acompte payé</span>
                    <span className="font-black">{activeOrder.acompte_paye.toLocaleString()} {currency}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="opacity-60">Mensualités</span>
                    <span className="font-black">{activeOrder.mensualite_montant.toLocaleString()} {currency} / mois</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-200 dark:border-white/10 flex flex-col justify-center text-center space-y-4 dark:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-black text-slate-900 dark:text-white uppercase">Séquestre Actif</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Vos fonds sont en sécurité. Ils ne seront libérés qu'après votre validation finale sur le terrain.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm">
             <Package className="w-16 h-16 text-slate-200 mx-auto mb-6" />
             <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-4">Aucune commande en cours</h2>
             <button onClick={handleNavigateToCatalog} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                Voir le catalogue
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
