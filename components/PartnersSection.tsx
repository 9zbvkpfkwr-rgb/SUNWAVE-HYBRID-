import React from 'react';
import { Building2, Landmark, Users2, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface Partner {
  id: string;
  name: string;
  type: 'Bancaire' | 'Social' | 'Institutionnel';
  logo: string;
  description: string;
}

interface PartnersSectionProps {
  onContact?: () => void;
}

const PARTNERS: Partner[] = [
  {
    id: 'p1',
    name: 'Banque Atlantique',
    type: 'Bancaire',
    logo: 'https://picsum.photos/seed/bank1/200/100',
    description: 'Partenaire financier pour les solutions de crédit solaire.'
  },
  {
    id: 'p2',
    name: 'Ecobank',
    type: 'Bancaire',
    logo: 'https://picsum.photos/seed/bank2/200/100',
    description: 'Accompagnement des PME dans leur transition énergétique.'
  },
  {
    id: 'p3',
    name: 'ONG Énergie pour Tous',
    type: 'Social',
    logo: 'https://picsum.photos/seed/social1/200/100',
    description: 'Soutien aux projets d\'électrification rurale.'
  },
  {
    id: 'p4',
    name: 'Ministère de l\'Énergie',
    type: 'Institutionnel',
    logo: 'https://picsum.photos/seed/inst1/200/100',
    description: 'Cadre réglementaire et promotion des énergies renouvelables.'
  }
];

const PartnersSection: React.FC<PartnersSectionProps> = ({ onContact }) => {
  return (
    <motion.section 
      id="partners" 
      className="py-32 md:py-48 bg-slate-50 dark:bg-slate-950/50 scroll-mt-24"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20 mb-8"
          >
            <Building2 className="w-4 h-4" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Écosystème</span>
          </motion.div>
          <h2 className="text-[3rem] md:text-[4.5rem] font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tighter leading-[0.95]">Nos <br /><span className="text-emerald-600">Partenaires</span></h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Sunwave Hybrid collabore avec des institutions de premier plan pour garantir la fiabilité, 
            le financement et l'impact social de nos solutions énergétiques.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 p-12 md:p-16 bg-emerald-600 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10 max-w-2xl text-center md:text-left">
            <h3 className="text-[2.5rem] font-black mb-6 uppercase tracking-tighter leading-none">Devenir Partenaire</h3>
            <p className="text-emerald-50 font-medium text-lg leading-relaxed">
              Vous êtes une institution financière, une organisation sociale ou un acteur public ? 
              Rejoignez l'écosystème Sunwave pour accélérer l'accès à l'énergie propre.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContact}
            className="relative z-10 px-12 py-6 bg-white text-emerald-600 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-emerald-50 transition-all shrink-0"
          >
            Nous Contacter
          </motion.button>
          <Building2 className="absolute -right-16 -bottom-16 w-72 h-72 opacity-10" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PartnersSection;
