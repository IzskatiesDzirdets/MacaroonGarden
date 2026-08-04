import { motion } from 'framer-motion'

const FEATURE_ITEMS = [
  { tone: 'blush', title: 'Dabīgas izejvielas', body: 'Franču mandeles, dabīgi pigmenti un svaigi augļi — bez saīsinājumiem.' },
  { tone: 'gold', title: 'Dāvanu ateljē', body: 'Kastītes noformētas atbilstoši reizei — kāzām, dzimšanas dienām, dāvanām kolēģiem.' },
  { tone: 'sage', title: 'Pēc pasūtījuma', body: 'Garšas, krāsas un daudzums — jūsu izvēle, ne gatava veidne.' },
  { tone: 'blush', title: 'Piegāde Rīgā', body: 'Cepti pasūtījuma nedēļā, piegādāti tajā pašā vai nākamajā dienā.' },
]

const DOT_TONE = { blush: 'bg-blush', gold: 'bg-gold', sage: 'bg-sage' }
const TEXT_TONE = { blush: 'text-blush', gold: 'text-gold', sage: 'text-sage' }

export default function AboutStory() {
  return (
    <section id="story" className="relative bg-espresso-2 px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-2 md:items-center md:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">Mūsu stāsts</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.9rem)] leading-tight text-ivory">
            Katrs makarūns ir <em className="italic text-blush">mazs mākslas darbs</em>
          </h2>
          <p className="mt-5 text-ivory-dim leading-relaxed">
            Macaroon Garden dzima no aizrautības ar franču konditorejas mākslu. Ticam, ka katrs
            makarūns ir mazs prieka brīdis — kraukšķīgs apvalks, maiga pildīšana, perfekts balanss.
          </p>
          <p className="mt-4 text-ivory-dim leading-relaxed">
            Visi makarūni tiek gatavoti pēc pasūtījuma — svaigi, rokām, no dabīgām sastāvdaļām, Rīgā.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {FEATURE_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${DOT_TONE[item.tone]} mb-3`} />
              <h3 className={`font-display text-base leading-snug ${TEXT_TONE[item.tone]}`}>
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory-dim">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
