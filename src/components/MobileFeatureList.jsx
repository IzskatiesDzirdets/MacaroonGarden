import GlassCard from './GlassCard'
import { FEATURES } from '../data/features'

const TONE_BY_PIECE = {
  shellTop: 'blush', shellBottom: 'gold', filling: 'sage',
  crumbRose: 'blush', crumbPistachio: 'sage', crumbCocoa: 'gold',
}

export default function MobileFeatureList() {
  return (
    <section className="md:hidden bg-espresso px-5 py-14">
      <p className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-gold/80 mb-6 text-center">
        Kas ir katrā makarūnā
      </p>
      <div className="flex flex-col gap-4">
        {FEATURES.map((f) => {
          const tone = TONE_BY_PIECE[f.piece]
          const accentText = { blush: 'text-blush', gold: 'text-gold', sage: 'text-sage' }[tone]
          return (
            <GlassCard key={f.id} tone={tone}>
              <p className={`font-mono text-[0.65rem] tracking-[0.18em] uppercase ${accentText}`}>
                {f.eyebrow}
              </p>
              <h3 className="mt-2 font-display text-lg leading-snug text-ivory">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory-dim">{f.body}</p>
            </GlassCard>
          )
        })}
      </div>
    </section>
  )
}
