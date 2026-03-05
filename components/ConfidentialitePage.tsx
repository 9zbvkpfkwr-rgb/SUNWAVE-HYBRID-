
import React, { useEffect } from 'react';
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';

interface ConfidentialitePageProps {
  onBack: () => void;
}

const ConfidentialitePage: React.FC<ConfidentialitePageProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-emerald-600 font-bold mb-8 hover:gap-3 transition-all group"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l'accueil
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-xl border border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                Politique de Confidentialité
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Dernière mise à jour : 21 Février 2026</p>
            </div>
          </div>

          <div className="space-y-12 text-slate-600 dark:text-slate-400 leading-relaxed">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">1. Collecte des Données</h2>
              </div>
              <p>
                Chez SUNWAVE HYBRID, nous collectons uniquement les informations nécessaires pour vous fournir nos services d'énergie solaire. Cela inclut votre nom, prénom, numéro de téléphone, adresse e-mail et localisation pour les installations.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">2. Utilisation des Informations</h2>
              </div>
              <p>
                Vos données sont utilisées pour :
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Traiter vos commandes et installations de packs solaires.</li>
                <li>Assurer le support technique et le service après-vente (SAV).</li>
                <li>Vous envoyer des notifications importantes concernant votre système hybride.</li>
                <li>Améliorer nos simulateurs et offres commerciales.</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">3. Protection et Partage</h2>
              </div>
              <p>
                SUNWAVE HYBRID s'engage à ne jamais vendre vos données personnelles à des tiers. Nous utilisons des protocoles de sécurité avancés pour protéger vos informations contre tout accès non autorisé. Le partage de données se limite strictement à nos partenaires logistiques pour la livraison de votre matériel.
              </p>
            </section>

            <section className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-emerald-600/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Contactez-nous</h3>
              <p className="text-sm">
                Pour toute question concernant vos données personnelles, vous pouvez contacter notre délégué à la protection des données via le support technique ou par e-mail à : <span className="text-emerald-600 font-bold">Sunwavehybrid@gmail.com</span>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidentialitePage;
