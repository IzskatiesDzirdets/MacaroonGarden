import GlassCard from './GlassCard'

const TONE_BY_PIECE = {
  shellTop: 'blush',
  shellBottom: 'gold',
  filling: 'sage',
  crumbRose: 'blush',
  crumbPistachio: 'sage',
  crumbCocoa: 'gold',
}

export default function FeatureCard({ feature, innerRef }) {
  const tone = TONE_BY_PIECE[feature.piece] ?? 'default'
  const accentText = {
    blush: 'text-blush',
    gold: 'text-gold',
    sage: 'text-sage',
  }[tone]

  return (
    <div ref={innerRef} className="pointer-events-none w-[min(78vw,20rem)] opacity-0">
      <GlassCard tone={tone} className="pointer-events-auto">
        <p className={`font-mono text-[0.68rem] tracking-[0.18em] uppercase ${accentText}`}>
          {feature.eyebrow}
        </p>
        <h3 className="mt-2 font-display text-xl leading-snug text-ivory">
          {feature.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ivory-dim">
          {feature.body}
        </p>
      </GlassCard>
    </div>
  )
}
