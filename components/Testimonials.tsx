import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  quote: string;
  rating: number;
  image: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "M. Ibrahima Keïta",
    location: "CITE AKANDJE, BINGERVILLE (RCI)",
    quote: "J'étais sceptique face à la chaleur, mais le matériel Sunwave résiste parfaitement. Ma facture d'électricité a chuté et le délestage n'est plus un problème pour ma famille.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Mme. Fatou Ndiaye",
    location: "CITE VERTE, YOPOUGON (RCI)",
    quote: "Le pack Famille est un investissement rentable. Le service client est très réactif et les économies sur ma facture d'électricité sont réelles dès le premier mois.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "M. Kouassi Koffi",
    location: "Cocody, Abidjan (CI)",
    quote: "Une équipe très professionnelle et un SAV réactif sur WhatsApp. J'ai choisi le plan flexible en 20 mois, c'est vraiment accessible pour tout le monde ici à Abidjan.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=koffi"
  }
];

const Testimonials: React.FC = () => {
  return (
    <motion.section 
      id="testimonials" 
      className="py-32 md:py-48 bg-transparent relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20 mb-8"
          >
            <Star className="w-4 h-4 fill-current" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Témoignages</span>
          </motion.div>
          <h2 className="text-4xl md:text-[4.5rem] font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tighter leading-[0.95]">Ils nous font <br /><span className="text-emerald-600">Confiance</span></h2>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Découvrez les retours d'expérience de nos clients satisfaits à travers l'Afrique de l'Ouest.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-10">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div 
              key={t.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 relative group hover:shadow-xl transition-all duration-500"
            >
              <div className="absolute top-8 right-10 text-slate-100 dark:text-slate-800 group-hover:text-emerald-500/10 transition-colors duration-500">
                <Quote className="w-12 h-12" />
              </div>
              
              <div className="flex gap-1 mb-8">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-lg text-slate-700 dark:text-slate-300 mb-10 leading-relaxed relative z-10 font-medium font-display">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-4 border-t border-slate-50 dark:border-slate-800 pt-8 mt-auto">
                <div className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-800 shadow-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight tracking-tight font-display">{t.name}</h4>
                  <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-[0.2em] mt-1">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonials;
