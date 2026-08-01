import gameHtml from '../game.html?raw'

export default function GameSection() {
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
            srcDoc={gameHtml}
            title="Makarūnu Mozaīka"
            className="h-full w-full border-none block"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
