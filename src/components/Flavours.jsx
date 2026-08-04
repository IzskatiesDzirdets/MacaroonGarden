import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCMS } from '../hooks/useCMS'

export default function Flavours() {
  const { flavoursList, moodButtons, cmsContent, incrementFlavourClick } = useCMS()
  const [selectedMood, setSelectedMood] = useState('all')

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop if fallback fails
    e.target.src = '/assets/logo.webp'; // Graceful fallback to the beautiful brand logo
  }

  // Get current active mood configuration
  const activeMoodBtn = moodButtons.find(m => m.category === selectedMood) || moodButtons[0]
  const highlightColor = activeMoodBtn?.highlightColor || '#D9A441'

  // Filter Flavours based on selected category (if not 'all')
  const displayedFlavours = flavoursList.filter(f => {
    if (f.hidden) return false
    if (selectedMood === 'all') return true
    return f.id === selectedMood
  })

  const handleFlavourCardClick = (id) => {
    incrementFlavourClick(id)
  }

  return (
    <section id="flavours" className="bg-espresso px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Headers */}
        <div className="text-center mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">
            {cmsContent.flavours?.subtitle || 'Garšu kolekcija'}
          </p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.9rem)] text-ivory">
            {cmsContent.flavours?.title || 'Izvēlies savu'}{' '}
            <em className="italic text-blush">{cmsContent.flavours?.italicWord || 'iecienīto'}</em>
          </h2>
        </div>

        {/* Dynamic Mood / Filter Quick Navigation buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {moodButtons.map((btn) => {
            const isSelected = selectedMood === btn.category
            return (
              <button
                key={btn.id}
                onClick={() => setSelectedMood(btn.category)}
                style={{
                  borderColor: isSelected ? btn.highlightColor : 'rgba(255, 255, 255, 0.1)',
                  backgroundColor: isSelected ? `${btn.highlightColor}15` : 'transparent',
                  color: isSelected ? btn.highlightColor : '#FFFDF9'
                }}
                className="rounded-full border px-5 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {displayedFlavours.map((f, i) => {
              // Custom tones matching
              const borderStyle = {
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }
              const dotStyle = {
                backgroundColor: highlightColor
              }
              const badgeStyle = {
                backgroundColor: highlightColor,
                color: '#2C1810'
              }

              return (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => handleFlavourCardClick(f.id)}
                  style={borderStyle}
                  className="relative rounded-2xl border bg-espresso-3/60 p-5 text-center transition-all flex flex-col items-center justify-between hover:border-gold/30 cursor-pointer"
                >
                  {f.badge && (
                    <span
                      style={badgeStyle}
                      className="absolute right-3 top-3 z-10 rounded-full px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-wider"
                    >
                      {f.badge}
                    </span>
                  )}

                  {/* Flavour Image with uniform sizing, object-fit and graceful fallback error handler */}
                  <div className="w-full aspect-square overflow-hidden rounded-xl mb-4 bg-espresso-2/50 relative shadow-[0_4px_12px_rgba(61,35,20,0.06)] border border-white/5">
                    <img
                      src={f.image}
                      alt={f.name}
                      onError={handleImageError}
                      className="w-full h-full object-cover aspect-ratio-[1/1] transition-transform duration-500 hover:scale-110"
                    />
                  </div>

                  <div className="flex flex-col items-center w-full">
                    <span style={dotStyle} className="mb-3 block h-2 w-2 rounded-full" />
                    <h3 className="font-display text-base leading-snug text-ivory font-bold">{f.name}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-ivory-dim">{f.note}</p>
                    <span className="font-mono text-[10px] text-gold/80 block mt-2 font-bold">{f.price ? f.price.toFixed(2) : '2.20'} €</span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
