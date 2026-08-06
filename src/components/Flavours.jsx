import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCMS } from '../hooks/useCMS'

export default function Flavours() {
  const { flavoursList, moodButtons } = useCMS()
  const [selectedMood, setSelectedMood] = useState('all')

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/assets/logo.webp';
  }

  // Filter flavours depending on the selected mood category filter
  const filteredFlavours = flavoursList.filter(f => {
    if (f.hidden) return false
    if (selectedMood === 'all') return true

    // Check if the flavor ID or tone corresponds to selectedMood ID or category
    const activeMoodObj = moodButtons.find(m => m.id === selectedMood)
    if (!activeMoodObj) return true

    return activeMoodObj.category === 'all' || f.id.includes(activeMoodObj.category) || f.tone === activeMoodObj.category
  })

  return (
    <section id="flavours" className="relative z-10 bg-espresso px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">Garšu kolekcija</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.9rem)] text-ivory">
            Izvēlies savu <em className="italic text-blush">iecienīto</em>
          </h2>
        </div>

        {/* Dynamic CMS Mood buttons */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {moodButtons.map((mood) => {
            const isSelected = selectedMood === mood.id
            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'font-bold shadow-md scale-105'
                    : 'bg-white/5 border-white/5 text-ivory-dim hover:bg-white/10 hover:text-white'
                }`}
                style={{
                  borderColor: isSelected ? mood.highlightColor : '',
                  backgroundColor: isSelected ? `${mood.highlightColor}15` : '',
                  color: isSelected ? mood.highlightColor : '',
                  backgroundImage: mood.image ? `linear-gradient(rgba(61,35,20,0.85), rgba(61,35,20,0.85)), url(${mood.image})` : '',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <span>{mood.label}</span>
              </button>
            )
          })}
        </div>

        {/* Dynamic Flavour Cards */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {filteredFlavours.map((f, i) => (
              <motion.div
                layout
                key={f.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-2xl border border-white/10 bg-espresso-3/60 p-5 text-center flex flex-col items-center justify-between hover:border-gold/30 hover:bg-espresso-3/90 transition-colors duration-300"
              >
                {f.badge && (
                  <span className="absolute right-3 top-3 z-10 rounded-full px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-wider bg-gold text-espresso font-bold">
                    {f.badge}
                  </span>
                )}

                {/* Flavour Image */}
                <div className="w-full aspect-square overflow-hidden rounded-xl mb-4 bg-espresso-2/50 relative shadow-[0_4px_12px_rgba(61,35,20,0.06)] border border-white/5">
                  <img
                    src={f.image}
                    alt={f.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover aspect-ratio-[1/1] transition-transform duration-500 hover:scale-110"
                  />
                </div>

                <div className="flex flex-col items-center w-full">
                  <span className="mb-3 block h-2 w-2 rounded-full bg-gold" />
                  <h3 className="font-display text-sm leading-snug text-ivory font-bold">{f.name}</h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-ivory-dim/80">{f.note}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
