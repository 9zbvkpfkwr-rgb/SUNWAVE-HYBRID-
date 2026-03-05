
import React from 'react';
import { X, Calendar, Tag, Clock, Share2, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BlogPost } from '../types';
import { marked } from 'marked';

interface BlogModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ post, isOpen, onClose }) => {
  if (!post) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header Image */}
            <div className="relative h-[300px] md:h-[450px] shrink-0">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-2xl transition-all z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="absolute bottom-10 left-10 right-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-2 text-white/80 text-[10px] font-bold uppercase tracking-widest">
                    <Clock className="w-3 h-3" /> 5 min de lecture
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-tight">
                  {post.title}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 md:p-16 no-scrollbar">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-12 pb-8 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-black text-lg">
                      S
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Rédaction Sunwave</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(post.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-600 rounded-xl transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-600 rounded-xl transition-all">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div 
                  className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:text-lg prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: marked.parse(post.content) }}
                />

                <div className="mt-20 p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 text-center">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-4 tracking-tight">Cet article vous a été utile ?</h4>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Partagez vos impressions avec notre communauté ou posez vos questions à notre assistant expert.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-emerald-500 transition-all">
                      Partager l'article
                    </button>
                    <button onClick={onClose} className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all">
                      Retour au blog
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BlogModal;
