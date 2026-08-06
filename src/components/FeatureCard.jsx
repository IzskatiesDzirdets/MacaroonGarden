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
      <GlassCard tone={tone} className="pointer-events-auto overflow-hidden">
        {feature.imageUrl && (
          <img
            src={feature.imageUrl}
            alt={feature.title}
            className="w-full h-36 object-cover rounded-2xl mb-4 shadow-[0_6px_16px_rgba(61,35,20,0.12)] border border-white/5"
          />
        )}
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
