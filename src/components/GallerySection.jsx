import { motion } from 'framer-motion'
import { useCMS } from '../hooks/useCMS'

export default function GallerySection() {
  const { galleryList } = useCMS()

  // Only display active images
  const activeGallery = galleryList.filter(item => item.active !== false)

  if (activeGallery.length === 0) return null

  return (
    <section id="gallery" className="relative z-10 bg-espresso py-24 px-6 md:px-16 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">Premium vizualizācija</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.9rem)] text-ivory">
            Zīmola <em className="italic text-blush">Galerija</em>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-ivory-dim">
            Ieskaties mūsu ekskluzīvajā franču konditorejas meistardarbu ateljē caur foto un video mirkļiem.
          </p>
        </div>

        {/* Swiper list container with CSS snaps */}
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-thin py-4 scroll-smooth">
          {activeGallery.map((item) => (
            <div
              key={item.id}
              className="w-[280px] sm:w-[320px] shrink-0 snap-center rounded-2xl border border-white/5 bg-espresso-3/50 p-3 shadow-lg relative group transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="w-full h-64 overflow-hidden rounded-xl relative bg-black">
                {item.type === 'video' ? (
                  <video
                    src={item.image}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={item.image}
                    alt={item.caption}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/logo.webp' }}
                  />
                )}
              </div>
              <p className="mt-3 font-body text-xs text-ivory/80 leading-relaxed font-semibold italic text-center px-1">
                {item.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
