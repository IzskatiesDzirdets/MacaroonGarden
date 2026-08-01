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

const GRADIENTS = [
  'linear-gradient(160deg, #FFFDF9 0%, #FAEDF0 50%, #F5D5E0 100%)', // Rose
  'linear-gradient(160deg, #FFFDF9 0%, #EBF4EE 50%, #D4EDE6 100%)', // Pistachio
  'linear-gradient(160deg, #FFFDF9 0%, #F2EBF7 50%, #E8E0F0 100%)', // Lavender
  'linear-gradient(160deg, #FFFDF9 0%, #FAF3EC 50%, #F0E6D8 100%)', // Chocolate
  'linear-gradient(160deg, #FFFDF9 0%, #FAFAEC 50%, #F5F2D8 100%)', // Lemon
]

const FLAVORS_DATA = [
  { name: 'Rozūdens',  c1: '#F2B8CB', c2: '#D4748E' },
  { name: 'Pistācija', c1: '#A8D4B0', c2: '#6FA87A' },
  { name: 'Lavanda',   c1: '#C8B8DC', c2: '#9A85BE' },
  { name: 'Šokolāde',  c1: '#C4956A', c2: '#8B5E3C' },
  { name: 'Citrons',   c1: '#EEE880', c2: '#C8C038' },
]

export default function HeroExplode() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const subRef = useRef(null)
  const cueRef = useRef(null)
  const cardRefs = useRef({})
  const progressRef = useRef(0)
  const [isDesktop, setIsDesktop] = useState(true)
  const [isTestMode, setIsTestMode] = useState(false)
  const [activeFlavor, setActiveFlavor] = useState(0)

  useEffect(() => {
    setIsDesktop(window.matchMedia('(min-width: 768px)').matches)
    setIsTestMode(
      window.location.search.includes('test=true') ||
      /headless/i.test(navigator.userAgent)
    )
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
      className={`relative w-full overflow-hidden transition-all duration-1000 ${isDesktop ? 'h-screen' : 'min-h-[105vh]'}`}
      style={{ background: GRADIENTS[activeFlavor] }}
    >
      <div className="absolute inset-0">
        {!isTestMode ? (
          <Suspense
            fallback={
              <div className="h-full w-full animate-pulse bg-espresso-2" />
            }
          >
            <MacaronScene progressRef={progressRef} static={!isDesktop} flavorIndex={activeFlavor} />
          </Suspense>
        ) : (
          <div className="h-full w-full bg-espresso-2" />
        )}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-between text-center px-6 py-24 md:py-28">
        <div className="flex flex-col items-center justify-center flex-1 max-w-4xl">
          <p ref={subRef} className="font-mono text-xs tracking-[0.3em] uppercase text-gold/80 mb-4">
            Macaroon Garden — Rīga
          </p>
          <h1 ref={headingRef} className="font-display text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.98] text-ivory max-w-4xl">
            Katrs makarūns <em className="italic text-blush">sadalās</em>,<br />lai parādītu, kas tajā ir.
          </h1>
        </div>

        {/* Dynamic Flavor and Background Selector */}
        <div className="z-10 w-full max-w-lg mb-8 md:mb-12">
          <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
            {FLAVORS_DATA.map((f, i) => (
              <button
                key={f.name}
                onClick={() => setActiveFlavor(i)}
                className="flex flex-col items-center gap-1.5 focus:outline-none group cursor-pointer"
              >
                <div
                  className={`h-11 w-11 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15),0_3px_10px_rgba(0,0,0,0.25)] transition-all duration-300 group-hover:scale-105 ${
                    activeFlavor === i
                      ? 'ring-2 ring-gold scale-110 shadow-[0_4px_15px_rgba(201,122,150,0.35)]'
                      : 'ring-1 ring-white/10'
                  }`}
                  style={{
                    background: `radial-gradient(circle at 35% 35%, #ffffff66, transparent), ${f.c1}`,
                  }}
                />
                <span
                  className={`font-mono text-[9px] uppercase tracking-wider transition-colors ${
                    activeFlavor === i ? 'text-gold font-bold' : 'text-ivory-dim/75 group-hover:text-ivory'
                  }`}
                >
                  {f.name}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-4 font-mono text-[9px] uppercase tracking-widest text-ivory-dim/50">
            Maini garšas noskaņu un vēro, kā mainās makarūna krāsa
          </p>
        </div>
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
