import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const FLS = [
  { id: 'rose',      nm: 'Roze un Avenes',       c: '#E3A6B4', e: '🌹' },
  { id: 'pistachio', nm: 'Pistācija un Vaniļa',  c: '#8CA37C', e: '🥜' },
  { id: 'lavender',  nm: 'Mellenes un Lavanda',  c: '#B4A5CC', e: '🫐' },
  { id: 'chocolate', nm: 'Beļģu šokolāde',       c: '#C9A15A', e: '🍫' },
  { id: 'lemon',     nm: 'Citronu Kurds',        c: '#E4C98A', e: '🍋' },
]

const SZS = [4, 9, 12, 18, 24, 30]

function gCols(s) {
  return s <= 4 ? 2 : s <= 9 ? 3 : s <= 12 ? 4 : s <= 18 ? 6 : 6
}

export default function BoxBuilder({ selectedBoxes = [], setSelectedBoxes }) {
  const [sz, setSz] = useState(12)
  const [box, setBox] = useState([])
  const [hint, setHint] = useState('')

  const chgSz = (s) => {
    setSz(s)
    if (box.length > s) {
      setBox(box.slice(0, s))
    }
    setHint('')
  }

  const handleAddBoxToOrder = () => {
    if (box.length === 0) return
    const newBox = {
      id: Date.now(),
      size: sz,
      flavors: [...box],
    }
    setSelectedBoxes([...selectedBoxes, newBox])
    setBox([]) // clear workspace for building the next box
    setHint('🎉 Kastīte pievienota pasūtījumam! Saliec nākamo vai dodies lejā uz pasūtījuma formu. 🌸')
  }

  const handleRemoveAddedBox = (boxId) => {
    setSelectedBoxes(selectedBoxes.filter((b) => b.id !== boxId))
  }

  const add = (f) => {
    if (box.length >= sz) {
      setHint('Kastīte ir pilna! Izvēlies lielāku izmēru, lai pievienotu vairāk.')
      return
    }
    setBox([...box, f])
    setHint('')
  }

  const rm = (i) => {
    setBox(box.filter((_, x) => x !== i))
  }

  const clear = () => {
    setBox([])
    setHint('')
  }

  const cnts = FLS.reduce((a, f) => ({ ...a, [f.id]: box.filter((b) => b.id === f.id).length }), {})
  const cols = gCols(sz)

  return (
    <section id="builder" className="bg-espresso-2 px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">Premium interaktīvs</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.9rem)] text-ivory">
            Uzcel savu <em className="italic text-blush">kastīti</em>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-ivory-dim">
            Izvēlies izmēru, pievieno izsmalcinātas garšas un dodies taisnā ceļā uz pasūtījumu.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Controls - Left Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Sizes */}
            <div className="rounded-2xl border border-white/10 bg-espresso-3/40 p-6 backdrop-blur-md">
              <p className="font-mono text-xs uppercase tracking-wider text-gold/90 mb-4">
                1. Izvēlies kastītes izmēru
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {SZS.map((s) => (
                  <button
                    key={s}
                    onClick={() => chgSz(s)}
                    className={`rounded-xl border py-3 text-center transition-all ${
                      sz === s
                        ? 'border-gold bg-gold/15 text-gold font-bold ring-1 ring-gold/30 shadow-[0_4px_20px_rgba(201,161,90,0.15)]'
                        : 'border-white/5 bg-espresso/30 text-ivory-dim hover:border-white/10 hover:text-ivory'
                    }`}
                  >
                    <span className="block font-display text-lg leading-none">{s}</span>
                    <span className="mt-1 block font-mono text-[0.55rem] uppercase tracking-wider opacity-70">gab.</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Flavours */}
            <div className="rounded-2xl border border-white/10 bg-espresso-3/40 p-6 backdrop-blur-md">
              <p className="font-mono text-xs uppercase tracking-wider text-gold/90 mb-4">
                2. Saliec savas garšas
              </p>
              <div className="space-y-2.5">
                {FLS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => add(f)}
                    disabled={box.length >= sz}
                    className={`flex w-full items-center gap-4 rounded-xl border p-3.5 text-left transition-all disabled:opacity-40 ${
                      cnts[f.id] > 0
                        ? 'border-gold/30 bg-espresso-3/80 shadow-md'
                        : 'border-white/5 bg-espresso/30 hover:border-white/10 hover:bg-espresso-3/20'
                    }`}
                    style={{
                      boxShadow: cnts[f.id] > 0 ? `inset 3px 0 0 ${f.c}` : '',
                    }}
                  >
                    {/* Circle Color dot */}
                    <div
                      className="h-8 w-8 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_2px_8px_rgba(0,0,0,0.3)] relative overflow-hidden flex-shrink-0"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, #ffffff55, transparent), ${f.c}`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
                    </div>

                    <div className="flex-1">
                      <span className="block font-display text-sm font-semibold text-ivory">
                        {f.e} {f.nm}
                      </span>
                      <span className="block text-[0.7rem] text-ivory-dim/60">
                        {cnts[f.id] > 0 ? `${cnts[f.id]}x pievienots` : 'Noklikšķini, lai pievienotu'}
                      </span>
                    </div>

                    <span className="font-mono text-lg text-gold/60 font-light hover:text-gold pr-1">+</span>
                  </button>
                ))}
              </div>
              {hint && (
                <p className="mt-3 font-mono text-[0.7rem] text-blush-deep text-center font-medium animate-pulse">
                  {hint}
                </p>
              )}
            </div>
          </div>

          {/* Visual Box Representation - Right Column */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-espresso-3 p-6 shadow-2xl ring-1 ring-white/5">
              <div className="text-center pb-4 border-b border-white/5">
                <h3 className="font-display text-lg font-bold text-gold">🎁 {sz}-Makarūnu Kastīte</h3>
                <p className="text-[0.7rem] text-ivory-dim/60 mt-0.5">
                  {box.length === 0
                    ? 'Kastīte pagaidām ir tukša'
                    : box.length === sz
                    ? '✨ Kastīte ir gatava pasūtīšanai!'
                    : `Pievienoti ${box.length} no ${sz} makarūniem`}
                </p>
              </div>

              {/* 2D grid representing macarons inside the box */}
              <div className="py-8 flex justify-center min-h-[220px] items-center">
                <div
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: sz }).map((_, i) => {
                    const item = box[i]
                    return item ? (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-11 w-11 rounded-full shadow-[inset_0_-3px_5px_rgba(0,0,0,0.25),0_4px_12px_rgba(0,0,0,0.35)] relative overflow-hidden cursor-pointer group flex-shrink-0"
                        style={{
                          background: `radial-gradient(circle at 35% 35%, #ffffff77 10%, transparent 60%), ${item.c}`,
                        }}
                        onClick={() => rm(i)}
                        title="Noklikšķini, lai noņemtu"
                      >
                        {/* Highlight shimmer */}
                        <div className="absolute top-[12%] left-[12%] h-[30%] w-[30%] rounded-full bg-white/40 filter blur-[1px]" />
                        {/* Hover remove cross overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-white font-bold">&#x2715;</span>
                        </div>
                      </motion.div>
                    ) : (
                      <div
                        key={i}
                        className="h-11 w-11 rounded-full border-1.5 border-dashed border-white/10 bg-espresso-2/40 flex-shrink-0"
                      />
                    )
                  })}
                </div>
              </div>

              {/* Summary and order */}
              {box.length > 0 && (
                <div className="mb-6 rounded-xl border border-white/5 bg-espresso-2/40 p-4 space-y-2">
                  <p className="font-mono text-[0.6rem] uppercase tracking-wider text-gold/75">
                    Kastītes sastāvs
                  </p>
                  <div className="space-y-1.5 text-xs text-ivory-dim">
                    {FLS.filter((f) => cnts[f.id] > 0).map((f) => (
                      <div key={f.id} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: f.c }} />
                        <span>{f.e} {f.nm}</span>
                        <span className="ml-auto font-mono text-[0.65rem] text-gold/80 font-bold">x{cnts[f.id]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                disabled={box.length === 0}
                onClick={handleAddBoxToOrder}
                className="w-full rounded-full bg-gold py-3.5 font-mono text-xs uppercase tracking-widest text-espresso font-bold shadow-[0_4px_24px_rgba(201,161,90,0.25)] transition-all hover:bg-gold-soft hover:shadow-[0_8px_32px_rgba(201,161,90,0.35)] disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🎁</span>
                <span>Pievienot šo kastīti pasūtījumam ({box.length}/{sz})</span>
              </button>

              {box.length > 0 && (
                <button
                  onClick={clear}
                  className="w-full mt-3 text-center text-[0.7rem] font-mono text-ivory-dim/60 underline hover:text-ivory cursor-pointer"
                >
                  Iztīrīt kastīti
                </button>
              )}
            </div>

            {/* List of currently added customized boxes */}
            {selectedBoxes.length > 0 && (
              <div className="mt-6 rounded-2xl border border-gold/15 bg-espresso-3 p-6 shadow-xl ring-1 ring-gold/10">
                <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                  <h4 className="font-display text-sm font-bold text-gold flex items-center gap-1.5">
                    <span>🛍️</span>
                    <span>Tavs iepirkumu grozs ({selectedBoxes.length} kastīt{selectedBoxes.length === 1 ? 'e' : 'es'})</span>
                  </h4>
                  <button
                    onClick={() => setSelectedBoxes([])}
                    className="text-[0.65rem] font-mono text-blush-deep hover:underline cursor-pointer"
                  >
                    Iztīrīt grozu
                  </button>
                </div>

                <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                  {selectedBoxes.map((addedBox, bIdx) => {
                    // Count flavor totals for this specific box
                    const fCounts = FLS.reduce((acc, f) => ({
                      ...acc,
                      [f.id]: addedBox.flavours ? addedBox.flavours.filter(x => x.id === f.id).length : addedBox.flavors.filter(x => x.id === f.id).length
                    }), {})

                    return (
                      <div
                        key={addedBox.id}
                        className="rounded-xl border border-white/5 bg-espresso-2/50 p-3 flex flex-col gap-2 relative group"
                      >
                        <div className="flex items-center justify-between font-mono text-[0.65rem] text-gold font-bold">
                          <span>KASTĪTE #{bIdx + 1} ({addedBox.size} gab.)</span>
                          <button
                            onClick={() => handleRemoveAddedBox(addedBox.id)}
                            className="text-[0.65rem] text-blush hover:text-red-500 font-bold hover:underline cursor-pointer"
                            title="Noņemt šo kastīti"
                          >
                            Noņemt
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 text-[0.65rem] text-ivory-dim/90">
                          {FLS.filter(f => fCounts[f.id] > 0).map(f => (
                            <span key={f.id} className="bg-espresso-3 border border-white/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span>{f.e}</span>
                              <span>{f.nm}</span>
                              <span className="font-bold text-gold">x{fCounts[f.id]}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Go to booking CTA */}
                <div className="mt-5 pt-4 border-t border-white/5 space-y-3">
                  <div className="flex justify-between text-xs font-mono font-bold text-ivory">
                    <span>KOPĒJAIS DAUDZUMS:</span>
                    <span className="text-gold font-body text-sm">
                      {selectedBoxes.reduce((acc, b) => acc + b.size, 0)} gab.
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full rounded-full bg-gold/10 border border-gold/40 py-2.5 font-mono text-xs uppercase tracking-wider text-gold font-bold hover:bg-gold/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>🌸</span>
                    <span>Doties uz pasūtīšanas formu</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
