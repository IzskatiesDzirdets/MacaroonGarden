import { motion } from 'framer-motion'
import { FLAVOURS } from '../data/flavours'

const RING_TONE = { blush: 'hover:border-blush/40', gold: 'hover:border-gold/40', sage: 'hover:border-sage/40' }
const DOT_TONE = { blush: 'bg-blush', gold: 'bg-gold', sage: 'bg-sage' }
const BADGE_TONE = { blush: 'bg-blush text-espresso', gold: 'bg-gold text-espresso', sage: 'bg-sage text-espresso' }

export default function Flavours() {
  return (
    <section id="flavours" className="bg-espresso px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">Garšu kolekcija</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.9rem)] text-ivory">
            Izvēlies savu <em className="italic text-blush">iecienīto</em>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {FLAVOURS.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className={`relative rounded-2xl border border-white/10 bg-espresso-3/60 p-5 text-center transition-colors ${RING_TONE[f.tone]}`}
            >
              {f.badge && (
                <span className={`absolute right-3 top-3 rounded-full px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-wider ${BADGE_TONE[f.tone]}`}>
                  {f.badge}
                </span>
              )}
              <span className={`mx-auto mb-3 block h-2 w-2 rounded-full ${DOT_TONE[f.tone]}`} />
              <h3 className="font-display text-base leading-snug text-ivory">{f.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-ivory-dim">{f.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
