
import React, { useMemo, useState, useEffect } from 'react';
import { db } from '../db';
import { SUNWAVE_PACKS, COUNTRIES } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, Users, LayoutDashboard, Search, Zap, 
  CheckCircle2, AlertTriangle, ArrowUpRight, 
  Smartphone, Bell, MessageSquare, ShieldAlert,
  ChevronRight, Activity, MapPin, Eye, Save, Trash2, Edit3, Plus, LogOut, ShieldCheck, BarChart3, Clock, Archive, Inbox, X, FileText, CreditCard, Calendar as CalendarIcon, Download, ClipboardCheck
} from 'lucide-react';
import { Order, User, ContactMessage, InstallationPhase } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'queue' | 'map'>('queue');
  const [gpsSearchTerm, setGpsSearchTerm] = useState('');
  const [tempRetour, setTempRetour] = useState('');
  
  // Lecture temps réel de la DB avec état local pour la fluidité
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allMessages, setAllMessages] = useState<ContactMessage[]>([]);

  const refreshData = () => {
    setAllOrders([...db.getAllOrders()]);
    setAllUsers([...db.getAllUsers()]);
    setAllMessages([...db.getAllMessages()]);
  };

  useEffect(() => {
    refreshData();
    
    // Actualisation automatique toutes les 60 secondes
    const interval = setInterval(() => {
      refreshData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const pendingPayments = useMemo(() => 
    allOrders.filter(o => o.statut === 'paiement_verif' || (o.receipt_id && o.statut === 'en_attente_paiement')),
  [allOrders]);

  const performanceData = useMemo(() => {
    return [
      { name: 'Phase 1', count: allOrders.filter(o => o.phase === 1).length },
      { name: 'Phase 2', count: allOrders.filter(o => o.phase === 2).length },
      { name: 'Phase 3', count: allOrders.filter(o => o.phase === 3).length },
      { name: 'Finalisé', count: allOrders.filter(o => o.statut === 'termine').length },
    ];
  }, [allOrders]);

  const handleUpdatePhase = (orderId: string, phase: InstallationPhase) => {
    db.updateOrder(orderId, { 
      phase: phase,
      statut: phase === 1 ? 'en_attente_paiement' : phase === 2 ? 'etude_terrain' : 'installation_en_cours'
    });
    refreshData();
  };

  const handleArchiveOrder = (orderId: string, archived: boolean) => {
    const action = archived ? "archiver" : "désarchiver";
    if (!window.confirm(`Voulez-vous vraiment ${action} cette commande ?`)) return;
    db.updateOrder(orderId, { archived });
    refreshData();
  };

  const handleUpdateRetour = (orderId: string) => {
    db.updateOrder(orderId, { retour_terrain: tempRetour });
    alert("Suivi mis à jour !");
    refreshData();
  };

  const validatePayment = (orderId: string) => {
    db.updateOrder(orderId, { 
      statut: 'etude_terrain',
      phase: 2
    });
    refreshData();
  };

  const rejectOrder = (orderId: string) => {
    db.updateOrder(orderId, { 
      statut: 'annule',
      archived: true
    });
    refreshData();
  };

  const exportToCSV = () => {
    const filteredOrders = allOrders.filter(o => {
      const client = allUsers.find(u => u.id === o.client_id);
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
         client?.nom.toLowerCase().includes(search) || 
         client?.prenom.toLowerCase().includes(search) || 
         client?.email.toLowerCase().includes(search) ||
         client?.telephone.toLowerCase().includes(search) ||
         o.id.toLowerCase().includes(search) || 
         o.ville.toLowerCase().includes(search);
       const matchesArchive = showArchived ? o.archived === true : !o.archived;
       return matchesSearch && matchesArchive;
    });

    const headers = ['ID Commande', 'Date', 'Statut', 'Phase', 'Client Nom', 'Client Prénom', 'Email', 'Téléphone', 'Pays', 'Ville', 'Adresse', 'Produit', 'Montant Total', 'Acompte', 'Mensualité', 'Reçu', 'Date RDV'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(o => {
        const client = allUsers.find(u => u.id === o.client_id);
        return [
          o.id,
          o.date_commande,
          o.statut,
          o.phase,
          `"${client?.nom || ''}"`,
          `"${client?.prenom || ''}"`,
          client?.email || '',
          client?.telephone || '',
          `"${o.pays || ''}"`,
          `"${o.ville || ''}"`,
          `"${o.adresse_livraison || ''}"`,
          o.produit_id,
          o.montant_total,
          o.acompte_paye,
          o.mensualite_montant,
          o.receipt_id || '',
          o.rdv_terrain_date || ''
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `export_commandes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl animate-in fade-in duration-700">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
           <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[32px] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all">
              <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1">Alertes Paiements</p>
              <h4 className={`text-2xl md:text-3xl font-black tracking-tighter ${pendingPayments.length > 0 ? 'text-brand-orange animate-pulse' : 'text-slate-900 dark:text-white'}`}>
                {pendingPayments.length} Reçus
              </h4>
           </div>
           <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[32px] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all">
              <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1">Chantiers Phase 2</p>
              <h4 className="text-2xl md:text-3xl font-black text-blue-600 tracking-tighter">
                {allOrders.filter(o => o.phase === 2).length} Sites
              </h4>
           </div>
           <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[32px] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all">
              <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1">Base Clients</p>
              <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{allUsers.length} Pros/Part</h4>
           </div>
           <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[32px] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all">
              <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1">Clients Actifs</p>
              <h4 className="text-2xl md:text-3xl font-black text-emerald-600 tracking-tighter">
                {allUsers.filter(u => allOrders.some(o => o.client_id === u.id && o.statut !== 'annule' && o.statut !== 'en_attente_paiement')).length} Actifs
              </h4>
           </div>
           <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[32px] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all">
              <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1">Commandes Traitées</p>
              <h4 className="text-2xl md:text-3xl font-black text-indigo-600 tracking-tighter">
                {allOrders.filter(o => o.statut !== 'en_attente_paiement' && o.statut !== 'annule').length} Traitées
              </h4>
           </div>
           <button onClick={onLogout} className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[32px] border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-red-500 font-black uppercase tracking-widest text-[10px] md:text-xs gap-3 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all">
             <LogOut className="w-6 h-6 md:w-8 md:h-8" /> Déconnexion
           </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_0.4fr] gap-10">
           <div className="space-y-8">
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[32px] md:rounded-[48px] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                       <h3 className="font-black text-lg md:text-xl uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
                          <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" /> Supervision des Flux
                       </h3>
                       <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Répartition par étape</p>
                    </div>
                 </div>
                 <div className="h-[200px] md:h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={performanceData}>
                          <defs>
                             <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                          <XAxis dataKey="name" tick={{fontSize: 9, fontWeight: 800}} axisLine={false} tickLine={false} dy={10} />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                            itemStyle={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}
                          />
                          <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[32px] md:rounded-[48px] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.3)] overflow-hidden">
                 <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                       <h3 className="font-black text-xl md:text-2xl uppercase tracking-tighter text-slate-900 dark:text-white">File de Suivi</h3>
                       <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                          <button 
                            onClick={() => setActiveTab('queue')}
                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'queue' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                             <Inbox className="w-3 h-3" /> Liste
                          </button>
                          <button 
                            onClick={() => setActiveTab('map')}
                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'map' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                             <MapPin className="w-3 h-3" /> Carte RDV
                          </button>
                       </div>
                       <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                          <button 
                            onClick={() => setShowArchived(false)}
                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${!showArchived ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                             Actifs
                          </button>
                          <button 
                            onClick={() => setShowArchived(true)}
                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${showArchived ? 'bg-white dark:bg-slate-700 text-brand-orange shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                             Archivés
                          </button>
                       </div>
                    </div>
                    <div className="w-full sm:w-auto">

                       <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                          <button
                            onClick={exportToCSV}
                            className="px-4 py-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all text-slate-600 dark:text-slate-300"
                          >
                            <Download className="w-4 h-4" /> Exporter CSV
                          </button>
                          <div className="relative flex-1 sm:flex-none">
     
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Chercher un client..." className="pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest w-full sm:w-64 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600" />
                          </div>
                          {activeTab === 'map' && (
                             <div className="relative flex-1 sm:flex-none">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                                <input value={gpsSearchTerm} onChange={e => setGpsSearchTerm(e.target.value)} placeholder="Code GPS..." className="pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest w-full sm:w-48 dark:text-white border border-blue-100 dark:border-blue-900/30 placeholder:text-slate-400 dark:placeholder:text-slate-600" />
                             </div>
                          )}
                       </div>
                    </div>
                 </div>

                 {activeTab === 'queue' ? (
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm min-w-[900px]">
                         <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] border-b border-slate-100 dark:border-white/5">
                            <tr>
                               <th className="p-8">Identité / Zone</th>
                               <th className="p-8">Infos Prospect (Phase 1)</th>
                               <th className="p-8">Infos Paiement & RDV</th>
                               <th className="p-8">Phase Actuelle</th>
                               <th className="p-8">Décisions HQ / Actions</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {allOrders.filter(o => {
                               const client = allUsers.find(u => u.id === o.client_id);
                               const search = searchTerm.toLowerCase();
                               const matchesSearch = 
                                  client?.nom.toLowerCase().includes(search) || 
                                  client?.prenom.toLowerCase().includes(search) || 
                                  client?.email.toLowerCase().includes(search) ||
                                  client?.telephone.toLowerCase().includes(search) ||
                                  o.id.toLowerCase().includes(search) || 
                                  o.ville.toLowerCase().includes(search);
                                const matchesArchive = showArchived ? o.archived === true : !o.archived;
                                return matchesSearch && matchesArchive;
                            }).map(order => {
                               const client = allUsers.find(u => u.id === order.client_id);
                               const hasReceipt = !!order.receipt_id;
                               return (
                                  <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                     <td className="p-8">
                                        <p className="font-black text-slate-900 dark:text-white text-base">{client?.prenom} {client?.nom}</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1">{client?.email}</p>
                                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">{order.pays} • {order.ville}</p>
                                     </td>
                                     <td className="p-8">
                                        {order.phase === 1 ? (
                                          <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
                                              <CalendarIcon className="w-3 h-3" /> Inscrit le: {new Date(client?.date_inscription || '').toLocaleDateString('fr-FR')}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
                                              <Activity className="w-3 h-3" /> Source: <span className="uppercase tracking-widest text-emerald-600">{client?.source || 'Organique'}</span>
                                            </div>
                                          </div>
                                        ) : (
                                          <span className="text-[10px] text-slate-400 italic">-</span>
                                        )}
                                     </td>
                                     <td className="p-8">
                                        {hasReceipt ? (
                                          <div className="flex items-center gap-2 text-brand-orange font-mono font-black text-[10px] bg-orange-50 dark:bg-orange-950/20 px-2 py-1 rounded-lg w-fit mb-2">
                                             <ShieldAlert className="w-3 h-3" /> TRÉSO: {order.receipt_id}
                                          </div>
                                        ) : (
                                          <p className="text-[10px] text-slate-400 font-bold uppercase italic mb-2">En attente de reçu...</p>
                                        )}
                                        {order.rdv_terrain_date && (
                                          <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] bg-blue-50 dark:bg-blue-950/20 px-2 py-1 rounded-lg w-fit">
                                               <Clock className="w-3 h-3" /> RDV: {order.rdv_terrain_date}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                              <span className={`w-1.5 h-1.5 rounded-full ${order.statut === 'etude_terrain' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                                              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                                                {order.statut === 'etude_terrain' ? 'Visite en attente' : 'Visite effectuée'}
                                              </span>
                                            </div>
                                          </div>
                                        )}
                                     </td>
                                     <td className="p-8">
                                        <div className="flex items-center gap-4">
                                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm relative ${
                                             order.phase === 1 ? 'bg-amber-100 text-amber-700' :
                                             order.phase === 2 ? 'bg-blue-100 text-blue-700' :
                                             'bg-emerald-100 text-emerald-700'
                                           }`}>
                                              {order.phase}
                                              {order.retour_terrain && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
                                                  <ClipboardCheck className="w-3 h-3" />
                                                </div>
                                              )}
                                           </div>
                                           <span className="text-[10px] font-black uppercase tracking-tight text-slate-500">{order.statut.replace('_', ' ')}</span>
                                        </div>
                                     </td>
                                     <td className="p-8">
                                        <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                           {(order.statut === 'paiement_verif' || hasReceipt) && order.phase === 1 && (
                                              <>
                                                <button onClick={() => validatePayment(order.id)} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 shadow-lg transition-all">Valider Paiement</button>
                                                <button onClick={() => rejectOrder(order.id)} className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 shadow-lg transition-all">Rejeter</button>
                                              </>
                                           )}
                                           {order.phase === 2 && (
                                              <button onClick={() => handleUpdatePhase(order.id, 3)} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-lg transition-all">Lancer Installation</button>
                                           )}
                                           {order.phase === 1 && client?.telephone && (
                                              <button 
                                                 onClick={() => window.open(`https://wa.me/${client.telephone.replace(/[^0-9]/g, '')}`, '_blank')}
                                                 className="px-5 py-2.5 bg-green-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-green-400 shadow-lg transition-all flex items-center gap-1"
                                              >
                                                 <MessageSquare className="w-3 h-3" /> Contacter
                                              </button>
                                           )}
                                           <button 
                                              onClick={() => {
                                                 setSelectedOrder(order);
                                                 setTempRetour(order.retour_terrain || '');
                                              }}
                                              className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-slate-900 transition-all"
                                              title="Voir les détails"
                                           >
                                              <Eye className="w-4 h-4" />
                                           </button>
                                            {order.gps_coordinates && (
                                               <button 
                                                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.gps_coordinates)}`, '_blank')}
                                                  className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                                                  title="Localiser sur la carte"
                                               >
                                                  <MapPin className="w-4 h-4" />
                                               </button>
                                            )}
                                            {(!order.archived) && (
                                               <button 
                                                  onClick={() => handleArchiveOrder(order.id, true)}
                                                  className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-amber-600 transition-all"
                                                  title="Archiver la commande"
                                               >
                                                  <Archive className="w-4 h-4" />
                                               </button>
                                            )}
                                            {(order.archived) && (
                                               <button 
                                                  onClick={() => handleArchiveOrder(order.id, false)}
                                                  className="p-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl hover:bg-amber-100 transition-all"
                                                  title="Désarchiver"
                                               >
                                                  <Archive className="w-4 h-4" />
                                               </button>
                                            )}
                                        </div>
                                     </td>
                                  </tr>
                               );
                            })}
                         </tbody>
                      </table>
                   </div>
                 ) : (
                   <div className="p-8">
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {allOrders.filter(o => {
                          const client = allUsers.find(u => u.id === o.client_id);
                          const search = searchTerm.toLowerCase();
                          const matchesSearch = 
                             client?.nom.toLowerCase().includes(search) || 
                             client?.prenom.toLowerCase().includes(search) || 
                             client?.email.toLowerCase().includes(search) ||
                             client?.telephone.toLowerCase().includes(search) ||
                             o.id.toLowerCase().includes(search) || 
                             o.ville.toLowerCase().includes(search);
                          const matchesGps = !gpsSearchTerm || o.gps_coordinates?.toLowerCase().includes(gpsSearchTerm.toLowerCase());
                          return o.rdv_terrain_date && !o.archived && matchesSearch && matchesGps;
                        }).map(order => {
                         const client = allUsers.find(u => u.id === order.client_id);
                         return (
                           <div key={order.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-white/5 hover:shadow-xl transition-all group">
                             <div className="flex justify-between items-start mb-4">
                               <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                 <MapPin className="w-5 h-5 text-blue-600" />
                               </div>
                               <div className="text-right">
                                 <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">RDV Prévu</p>
                                 <p className="text-[10px] font-black text-blue-600">{order.rdv_terrain_date}</p>
                               </div>
                             </div>
                             <h4 className="font-black text-slate-900 dark:text-white text-base mb-1">{client?.prenom} {client?.nom}</h4>
                             <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1">{client?.email}</p>
                             <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-4">{order.ville}, {order.pays}</p>
                             
                             <div className="space-y-3 mb-6">
                               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                 <Activity className="w-3 h-3" />
                                 <span>Statut: <span className="text-slate-900 dark:text-white uppercase">{order.statut.replace('_', ' ')}</span></span>
                               </div>
                               {order.gps_coordinates && (
                                 <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-white/5">
                                   <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                   <span className="truncate">{order.gps_coordinates}</span>
                                 </div>
                               )}
                             </div>

                             <div className="flex gap-2">
                               <button 
                                 onClick={() => {
                                    setSelectedOrder(order);
                                    setTempRetour(order.retour_terrain || '');
                                 }}
                                 className="flex-1 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                               >
                                 Détails
                               </button>
                               {order.gps_coordinates && (
                                 <button 
                                   onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.gps_coordinates)}`, '_blank')}
                                   className="px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-all"
                                 >
                                   <ArrowUpRight className="w-4 h-4" />
                                 </button>
                               )}
                             </div>
                           </div>
                         );
                       })}
                       {allOrders.filter(o => o.rdv_terrain_date && !o.archived).length === 0 && (
                         <div className="col-span-full py-20 text-center opacity-30">
                           <CalendarIcon className="w-12 h-12 mx-auto mb-4" />
                           <p className="text-xs font-black uppercase tracking-widest">Aucun RDV planifié pour le moment</p>
                         </div>
                       )}
                     </div>
                   </div>
                 )}
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-slate-900 p-6 md:p-8 rounded-[32px] md:rounded-[48px] text-white shadow-xl relative overflow-hidden border border-white/10 dark:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                 <CreditCard className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12" />
                 <h3 className="text-xl font-black mb-8 uppercase tracking-tighter flex items-center gap-3 text-white">
                    <ShieldAlert className="w-5 h-5 text-brand-orange" /> Paiements à Valider
                 </h3>
                 <div className="space-y-4">
                    {pendingPayments.length > 0 ? pendingPayments.map(order => {
                       const client = allUsers.find(u => u.id === order.client_id);
                       return (
                          <div key={order.id} className="p-5 bg-white/5 rounded-[28px] border border-white/10 hover:bg-white/10 transition-all group/pay">
                             <div className="flex justify-between items-start mb-3">
                                <div>
                                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{client?.prenom} {client?.nom}</p>
                                   <p className="text-[9px] text-slate-400 font-bold mt-0.5">ID: {order.id} • {order.receipt_id}</p>
                                </div>
                                <span className="text-[10px] font-black text-brand-orange">{order.acompte_paye.toLocaleString()} F</span>
                             </div>
                             <div className="flex gap-2">
                                <button onClick={() => validatePayment(order.id)} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all">Valider</button>
                                <button onClick={() => rejectOrder(order.id)} className="flex-1 py-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all">Rejeter</button>
                             </div>
                          </div>
                       );
                    }) : (
                       <div className="text-center py-10 opacity-30">
                          <CheckCircle2 className="w-10 h-10 mx-auto mb-3" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Tout est à jour</p>
                       </div>
                    )}
                 </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[32px] md:rounded-[48px] shadow-xl relative overflow-hidden border border-slate-200 dark:border-white/10">
                 <Bell className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-200 dark:text-white/5 rotate-12" />
                 <h3 className="text-xl font-black mb-8 uppercase tracking-tighter flex items-center gap-3 text-slate-900 dark:text-white">
                    <Activity className="w-5 h-5 text-brand-orange" /> Flux Alertes
                 </h3>
                 <div className="space-y-5">
                    {allMessages.filter(m => !m.traite).slice(0, 5).map(msg => (
                       <div key={msg.id} className="p-5 bg-white/5 rounded-[28px] border border-white/10 hover:bg-white/10 transition-all group/msg">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{msg.nom}</p>
                            <span className="text-[8px] text-slate-500 font-bold">{new Date(msg.date_envoi).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-300 leading-relaxed line-clamp-2">{msg.message}</p>
                       </div>
                    ))}
                    {allMessages.length === 0 && (
                       <div className="text-center py-10 opacity-30">
                          <CheckCircle2 className="w-10 h-10 mx-auto mb-3" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Aucune alerte</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl border border-slate-200 dark:border-white/10"
            >
            <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-black text-xl uppercase tracking-tighter text-slate-900 dark:text-white">Détails Commande</h3>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">ID: {selectedOrder.id}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedOrder(null);
                  setTempRetour('');
                }}
                className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-10">
              {/* Client & Produit */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Client</p>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-white/5">
                    {(() => {
                      const client = allUsers.find(u => u.id === selectedOrder.client_id);
                      return (
                        <>
                          <p className="font-black text-slate-900 dark:text-white text-lg">{client?.prenom} {client?.nom}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{client?.email}</p>
                          <p className="text-sm text-emerald-600 font-bold mt-1">{client?.telephone}</p>
                          <p className="text-[10px] font-black uppercase text-slate-400 mt-3">{client?.type_profil} • {client?.ville}</p>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Produit</p>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-white/5">
                    {(() => {
                      const pack = SUNWAVE_PACKS.find(p => p.id === selectedOrder.produit_id);
                      return (
                        <>
                          <p className="font-black text-slate-900 dark:text-white text-lg">{pack?.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Gamme {pack?.gamme}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Zap className="w-4 h-4 text-brand-orange" />
                            <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-300">{pack?.max_power}W Max</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Statut & Finance */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">État du Dossier</p>
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-white/5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${
                      selectedOrder.phase === 1 ? 'bg-amber-100 text-amber-700' :
                      selectedOrder.phase === 2 ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {selectedOrder.phase}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phase Actuelle</p>
                      <p className="font-black text-slate-900 dark:text-white uppercase text-sm mt-0.5">{selectedOrder.statut.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Financement</p>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase text-slate-400">Total</span>
                      <span className="font-black text-slate-900 dark:text-white">{selectedOrder.montant_total.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase text-emerald-600">Acompte</span>
                      <span className="font-black text-emerald-600">{selectedOrder.acompte_paye.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-white/5">
                      <span className="text-[10px] font-black uppercase text-slate-400">Reste</span>
                      <span className="font-black text-brand-orange">{(selectedOrder.reste_a_devoir || 0).toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logistique & RDV */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Logistique & Terrain</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-white/5 flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Livraison</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{selectedOrder.adresse_livraison}</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase mt-1">{selectedOrder.ville}, {selectedOrder.pays}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-white/5 flex items-start gap-4">
                    <CalendarIcon className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Visite Technique</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{selectedOrder.rdv_terrain_date || 'Non planifiée'}</p>
                      {selectedOrder.rdv_terrain_date && <p className="text-[10px] font-black text-blue-600 uppercase mt-1">Confirmé</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Techniques & Retour Terrain */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Suivi & Retour Terrain</p>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                    <textarea 
                      value={tempRetour}
                      onChange={(e) => setTempRetour(e.target.value)}
                      placeholder="Saisissez ici le compte-rendu de la visite technique ou les notes d'installation..."
                      className="w-full h-32 bg-white dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-medium focus:ring-1 focus:ring-emerald-500 dark:text-white placeholder:text-slate-400"
                    />
                    <button 
                      onClick={() => handleUpdateRetour(selectedOrder.id)}
                      className="w-full py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                    >
                      <Save className="w-4 h-4" /> Sauvegarder le Suivi
                    </button>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Notes Commerciales</p>
                    <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-3xl border border-amber-200/50 dark:border-amber-900/30">
                      <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-medium italic">
                        "{selectedOrder.notes}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-4">
              {selectedOrder.phase === 1 && (
                <>
                  <button 
                    onClick={() => { validatePayment(selectedOrder.id); setSelectedOrder(null); }}
                    className="flex-1 min-w-[200px] py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-500 shadow-lg transition-all"
                  >
                    Valider le Paiement
                  </button>
                  <button 
                    onClick={() => { rejectOrder(selectedOrder.id); setSelectedOrder(null); }}
                    className="flex-1 min-w-[200px] py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-500 shadow-lg transition-all"
                  >
                    Rejeter
                  </button>
                </>
              )}
              {selectedOrder.phase === 2 && (
                <button 
                  onClick={() => { handleUpdatePhase(selectedOrder.id, 3); setSelectedOrder(null); }}
                  className="flex-1 min-w-[200px] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 shadow-lg transition-all"
                >
                  Lancer l'Installation
                </button>
              )}
              <button 
                onClick={() => setSelectedOrder(null)}
                className="flex-1 min-w-[200px] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
