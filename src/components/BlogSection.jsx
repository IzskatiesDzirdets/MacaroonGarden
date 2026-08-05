import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCMS } from '../hooks/useCMS'

export default function BlogSection() {
  const { blogList } = useCMS()
  const [selectedPost, setSelectedPost] = useState(null)

  const activePosts = blogList.filter(post => post.active !== false)

  if (activePosts.length === 0) return null

  return (
    <section id="blog" className="bg-espresso-2 py-24 px-6 md:px-16 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">Padomi & stāsti</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.9rem)] text-ivory">
            Konditorejas <em className="italic text-blush">blogs</em>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-ivory-dim">
            Lasiet mūsu franču meistaru radītās receptes, temperēšanas padomus un svētku galda dekorēšanas iedvesmu.
          </p>
        </div>

        {/* Blog Posts Grid layout */}
        <div className="grid gap-8 sm:grid-cols-2">
          {activePosts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl border border-white/5 bg-espresso-3/30 p-5 shadow-md flex flex-col justify-between hover:border-gold/20 hover:bg-espresso-3/60 transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="space-y-4">
                {post.image && (
                  <div className="w-full h-48 overflow-hidden rounded-xl bg-black">
                    {post.type === 'video' ? (
                      <video src={post.image} className="w-full h-full object-cover pointer-events-none" />
                    ) : (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = '/logo.webp' }}
                      />
                    )}
                  </div>
                )}
                <div>
                  <span className="font-mono text-[9px] text-gold uppercase tracking-wider font-bold">
                    {post.date}
                  </span>
                  <h3 className="font-display text-lg font-bold text-ivory leading-snug group-hover:text-gold transition-colors mt-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-ivory-dim leading-relaxed mt-2 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-gold font-bold">
                <span>Lasīt rakstu →</span>
                <span className="bg-white/5 px-2 py-0.5 rounded text-[8px] uppercase tracking-widest text-ivory-dim font-bold">
                  {post.type}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Blog Post Modal details */}
        <AnimatePresence>
          {selectedPost && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-espresso/90 backdrop-blur-md">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-2xl bg-espresso-2 border border-white/10 rounded-2xl p-6 md:p-8 overflow-y-auto max-h-[85vh] shadow-2xl relative"
              >
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 rounded-full bg-white/5 p-2 text-ivory-dim hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>

                <div className="space-y-6">
                  {selectedPost.image && (
                    <div className="w-full h-64 overflow-hidden rounded-xl bg-black relative">
                      {selectedPost.type === 'video' ? (
                        <video src={selectedPost.image} className="w-full h-full object-cover" controls />
                      ) : (
                        <img
                          src={selectedPost.image}
                          alt={selectedPost.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = '/logo.webp' }}
                        />
                      )}
                    </div>
                  )}

                  <div>
                    <span className="font-mono text-[10px] text-gold uppercase tracking-wider font-bold">
                      {selectedPost.date}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-gold mt-1">
                      {selectedPost.title}
                    </h3>
                  </div>

                  <p className="text-sm text-ivory-dim leading-relaxed font-semibold italic border-l-2 border-gold pl-4">
                    {selectedPost.excerpt}
                  </p>

                  <div className="text-sm text-ivory-dim leading-relaxed whitespace-pre-wrap font-body">
                    {selectedPost.content}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
