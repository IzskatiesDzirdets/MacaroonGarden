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

export default function GameSection({ activeFlavor = 0 }) {
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

  return (
    <section id="game" className="bg-espresso-2 px-6 py-24 md:px-16 md:py-32">
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
        <div className="mx-auto max-w-[480px] overflow-hidden rounded-3xl border border-white/10 bg-espresso-3 shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 ring-gold/15 h-[min(78vh,680px)]">
          <iframe
            srcDoc={customGameHtml}
            title="Makarūnu Mozaīka"
            className="h-full w-full border-none block"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
