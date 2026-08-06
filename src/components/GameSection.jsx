import gameHtml from '../game.html?raw'

const FLAVOR_BACKGROUNDS = [
  'radial-gradient(120% 90% at 50% -10%, #FFFDF9 0%, #FAEDF0 55%, #F5D5E0 100%)', // Rose
  'radial-gradient(120% 90% at 50% -10%, #FFFDF9 0%, #EBF4EE 55%, #D4EDE6 100%)', // Pistachio
  'radial-gradient(120% 90% at 50% -10%, #FFFDF9 0%, #F2EBF7 55%, #E8E0F0 100%)', // Lavender
  'radial-gradient(120% 90% at 50% -10%, #FFFDF9 0%, #FAF3EC 55%, #F0E6D8 100%)', // Chocolate
  'radial-gradient(120% 90% at 50% -10%, #FFFDF9 0%, #FAFAEC 55%, #F5F2D8 100%)', // Lemon
]

const FLAVOR_THEMES = [
  { primary: '#C97A96', secondary: '#E8A4B8' }, // Rose
  { primary: '#6FA87A', secondary: '#A8D4B0' }, // Pistachio
  { primary: '#9A85BE', secondary: '#C8B8DC' }, // Lavender
  { primary: '#8B5E3C', secondary: '#C4956A' }, // Chocolate
  { primary: '#C8C038', secondary: '#EEE880' }, // Lemon
]

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCMS } from '../hooks/useCMS'

export default function GameSection({ activeFlavor = 0 }) {
  const { gameConfig } = useCMS()
  const [promoOpen, setPromoOpen] = useState(false)
  const [levelCounter, setLevelCounter] = useState(0)

  // Listen to message events from Game iframe
  useEffect(() => {
    const handleGameMessage = (event) => {
      const data = event.data
      if (!data) return

      if (data.type === 'mg_level_complete') {
        const nextCount = levelCounter + 1
        setLevelCounter(nextCount)

        // Trigger promo ad modal according to frequency
        const freq = gameConfig?.promoFrequency || 3
        if (nextCount > 0 && nextCount % freq === 0) {
          setTimeout(() => {
            setPromoOpen(true)
          }, 800)
        }
      } else if (data.type === 'mg_life_lost') {
        // Trigger offer when lives are depleted/lost
        if (data.livesLeft === 0) {
          setTimeout(() => {
            setPromoOpen(true)
          }, 800)
        }
      }
    }

    window.addEventListener('message', handleGameMessage)
    return () => window.removeEventListener('message', handleGameMessage)
  }, [levelCounter, gameConfig])

  // Dynamically override css variables and body background inside gameHtml so the game
  // skin completely matches the selected pastry flavor.
  const customGameHtml = gameHtml.replace(
    '</head>',
    `<style>
      :root {
        --rose-d: ${FLAVOR_THEMES[activeFlavor].primary} !important;
        --rose: ${FLAVOR_THEMES[activeFlavor].secondary} !important;
      }
      body {
        background: ${FLAVOR_BACKGROUNDS[activeFlavor]} !important;
      }
    </style></head>`
  )

  const handlePromoRedirect = () => {
    setPromoOpen(false)
    const target = gameConfig?.promoRedirectSection || '#builder'
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="game" className="bg-espresso-2 px-6 py-24 md:px-16 md:py-32 relative z-10">
      <div className="mx-auto max-w-4xl text-center">
        {/* Header */}
        <div className="mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">Atpūtas brīdis</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.9rem)] text-ivory">
            Makarūnu <em className="italic text-blush">Mozaīka</em>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-ivory-dim">
            Atpūties un uzspēlē mūsu bezgalīgo, relaksējošo puzles spēli. Ielogojies, lai tavs rekords tiktu saglabāts līderu sarakstā un tu varētu cīnīties par saldām balvām!
          </p>
        </div>

        {/* Frame container */}
        <div className="mx-auto max-w-[480px] landscape:max-w-[780px] overflow-hidden rounded-3xl border border-white/10 bg-espresso-3 shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 ring-gold/15 h-[min(78vh,680px)] landscape:h-[min(92vh,480px)] transition-all duration-300">
          <iframe
            srcDoc={customGameHtml}
            title="Makarūnu Mozaīka"
            className="h-full w-full border-none block"
            loading="lazy"
          />
        </div>
      </div>

      {/* Promotional special offer ad modal for players */}
      <AnimatePresence>
        {promoOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-espresso/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-espresso-2 border border-white/10 rounded-3xl p-8 shadow-2xl relative text-center space-y-6"
            >
              <button
                onClick={() => setPromoOpen(false)}
                className="absolute top-4 right-4 rounded-full bg-white/5 p-2 text-ivory-dim hover:bg-white/10 hover:text-white transition-colors cursor-pointer text-xs"
              >
                ✕
              </button>

              <div>
                <span className="text-4xl block mb-2">🎁</span>
                <span className="font-mono text-[10px] text-gold uppercase tracking-wider font-bold">
                  Spēlētāju Ekskluzīvais Piedāvājums
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-1">
                  Sveiciens, Mozaīkas Meistar!
                </h3>
              </div>

              <p className="text-sm text-ivory-dim leading-relaxed font-body">
                {gameConfig?.promoOfferText || 'Īpašs dāvanu kods spēles faniem! Izmanto kodu "GARDEN10" pirkuma grozā un baudi saldu atlaidi.'}
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handlePromoRedirect}
                  className="w-full rounded-full bg-gold py-3 font-mono text-xs uppercase tracking-widest text-espresso font-bold transition-all hover:bg-gold-soft cursor-pointer"
                >
                  Izmantot Piedāvājumu 🌸
                </button>
                <button
                  onClick={() => setPromoOpen(false)}
                  className="w-full rounded-full bg-white/5 py-3 font-mono text-xs uppercase tracking-widest text-ivory-dim hover:bg-white/10 cursor-pointer"
                >
                  Turpināt Spēli
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
