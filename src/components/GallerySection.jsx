import { motion } from 'framer-motion'
import { useCMS } from '../hooks/useCMS'

export default function GallerySection() {
  const { galleryList } = useCMS()

  return (
    <section id="gallery" className="bg-espresso-2 py-20 px-6 md:px-16 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">Premium iedvesma</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.9rem)] text-ivory">
            Dāvanu ateljē <em className="italic text-blush">galerija</em>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-ivory-dim">
            Skaties mūsu svaigi cepto makarūnu un dāvanu komplektu bildes tieši no mobilā telefona vai datora.
          </p>
        </div>

        {/* Horizontal Touch Scrollable Slider with CSS scroll-snap */}
        <div className="flex gap-6 overflow-x-auto pb-8 pt-4 px-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gold/25 scrollbar-track-transparent">
          {galleryList.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="min-w-[280px] sm:min-w-[340px] md:min-w-[380px] snap-center rounded-3xl border border-white/10 bg-espresso-3 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.45)] ring-1 ring-gold/10 overflow-hidden flex flex-col justify-between"
            >
              <div className="w-full aspect-square overflow-hidden rounded-2xl bg-espresso relative shadow-inner border border-white/5">
                <img
                  src={item.image}
                  alt={item.caption || 'Macaroon Garden dāvana'}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  onError={(e) => { e.target.onerror = null; e.target.src = '/assets/logo.webp' }}
                />
              </div>
              <p className="mt-4 font-display text-sm text-ivory text-center font-medium italic leading-relaxed text-gold-soft px-2">
                {item.caption || 'Macaroon Garden dāvanu komplekts'}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Swipe instruction tooltip for mobile screens */}
        <div className="text-center mt-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ivory-dim/50 animate-pulse">
            ← Pavelc pa labi vai kreisi, lai šķirstītu bildes →
          </p>
        </div>
      </div>
    </section>
  )
}
