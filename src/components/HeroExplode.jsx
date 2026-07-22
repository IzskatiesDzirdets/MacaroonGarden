import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FeatureCard from './FeatureCard'
import { FEATURES } from '../data/features'

const MacaronScene = lazy(() => import('../three/MacaronScene'))

gsap.registerPlugin(ScrollTrigger)

const TL_DURATION = 10
const CARD_POSITION_CLASS = [
  'absolute left-[4%] top-[16%]',
  'absolute right-[4%] top-[18%]',
  'absolute left-1/2 -translate-x-1/2 bottom-[8%]',
  'absolute left-[6%] bottom-[14%]',
  'absolute right-[6%] bottom-[16%]',
  'absolute left-1/2 -translate-x-1/2 top-[8%]',
]

export default function HeroExplode() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const subRef = useRef(null)
  const cueRef = useRef(null)
  const cardRefs = useRef({})
  const progressRef = useRef(0)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    setIsDesktop(window.matchMedia('(min-width: 768px)').matches)
  }, [])

  useEffect(() => {
    if (!isDesktop) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=550%',
          scrub: 1,
          pin: true,
          onUpdate: (self) => { progressRef.current = self.progress },
        },
        defaults: { ease: 'power2.out' },
      })

      tl.to([headingRef.current, subRef.current, cueRef.current], {
        opacity: 0, y: -30, duration: 0.6, stagger: 0.05,
      }, 0)

      FEATURES.forEach((f) => {
        const el = cardRefs.current[f.id]
        if (!el) return
        const [start, end] = f.window
        tl.fromTo(el,
          { opacity: 0, y: 26, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: (end - start) * TL_DURATION * 0.6 },
          start * TL_DURATION
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isDesktop])

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden bg-espresso ${isDesktop ? 'h-screen' : 'min-h-[92vh]'}`}
    >
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="h-full w-full animate-pulse bg-[radial-gradient(circle_at_50%_50%,#2A1E19,#140F0D)]" />
          }
        >
          <MacaronScene progressRef={progressRef} static={!isDesktop} />
        </Suspense>
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <p ref={subRef} className="font-mono text-xs tracking-[0.3em] uppercase text-gold/80 mb-4">
          Macaroon Garden — Rīga
        </p>
        <h1 ref={headingRef} className="font-display text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.98] text-ivory max-w-4xl">
          Katrs makarūns <em className="italic text-blush">sadalās</em>,<br />lai parādītu, kas tajā ir.
        </h1>
      </div>

      {isDesktop && (
        <div ref={cueRef} className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory-dim/70">
          <span className="font-mono text-[0.65rem] tracking-[0.25em] uppercase">Ritini</span>
          <span className="h-8 w-px bg-gradient-to-b from-gold to-transparent animate-pulse" />
        </div>
      )}

      {isDesktop && (
        <div className="absolute inset-0">
          {FEATURES.map((f, i) => (
            <div key={f.id} className={CARD_POSITION_CLASS[i]}>
              <FeatureCard feature={f} innerRef={(el) => (cardRefs.current[f.id] = el)} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
