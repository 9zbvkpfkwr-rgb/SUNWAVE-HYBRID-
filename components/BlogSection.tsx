import React, { useState } from 'react';
import { Calendar, Tag, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../db';
import { BlogPost } from '../types';
import BlogModal from './BlogModal';

const BlogSection: React.FC = () => {
  const allPosts = db.getBlogPosts();
  const [showAll, setShowAll] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const posts = showAll ? allPosts : allPosts.slice(0, 3);

  const handleReadMore = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  return (
    <motion.section 
      id="blog" 
      className="py-32 md:py-48 bg-white dark:bg-slate-950"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-10">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-emerald-600 mb-6"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">Actualités & Conseils</span>
            </motion.div>
            <h2 className="text-[3rem] md:text-[4.5rem] font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.95] font-display">
              Le Mag Solaire <br /><span className="text-emerald-600">Sunwave</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-8 font-medium text-xl leading-relaxed">
              Restez informé des dernières innovations et optimisez votre indépendance énergétique.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(!showAll)}
            className="px-10 py-5 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-xl"
          >
            {showAll ? 'Réduire le blog' : 'Voir tout le blog'}
          </motion.button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, idx) => (
            <motion.article 
              key={post.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col bg-slate-50 dark:bg-slate-900 rounded-[3.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-72 overflow-hidden cursor-pointer" onClick={() => handleReadMore(post)}>
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-8 left-8">
                  <span className="px-5 py-2.5 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 leading-tight group-hover:text-emerald-600 transition-colors duration-300 font-display cursor-pointer" onClick={() => handleReadMore(post)}>
                  {post.title}
                </h3>
                
                <p className="text-slate-500 dark:text-slate-400 text-base font-medium mb-10 line-clamp-3 flex-grow leading-relaxed">
                  {post.excerpt}
                </p>
                
                <motion.button 
                  whileHover={{ x: 5 }}
                  onClick={() => handleReadMore(post)}
                  className="flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-widest group/btn"
                >
                  Lire l'article 
                  <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <BlogModal 
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.section>
  );
};

export default BlogSection;
