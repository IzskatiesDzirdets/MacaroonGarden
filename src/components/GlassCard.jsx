export default function GlassCard({ children, className = '', tone = 'default' }) {
  const toneRing = {
    default: 'ring-gold/20',
    blush: 'ring-blush/25',
    sage: 'ring-sage/25',
  }[tone]

  return (
    <div
      className={[
        'rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl',
        'shadow-[0_8px_40px_rgba(0,0,0,0.45)] ring-1', toneRing,
        'p-6',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
