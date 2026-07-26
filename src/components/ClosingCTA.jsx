import { motion } from 'framer-motion'

export default function ClosingCTA() {
  return (
    <section className="relative bg-espresso px-6 py-28 md:py-40">
      <div className="mx-auto max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80"
        >
          Rīga · Pēc pasūtījuma
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-tight text-ivory"
        >
          Uzcel savu kastīti,<br /><span className="italic text-blush">nevis izvēlies no plaukta.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-6 max-w-md text-ivory-dim"
        >
          Izvēlies garšas, daudzumu un piegādes dienu — mēs ceptu tavu kastīti tajā pašā nedēļā un piegādājam Rīgā.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.18 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          href="https://macarongarden.netlify.app/#builder"
          className="mt-10 inline-block rounded-full bg-gold px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-espresso shadow-[0_10px_40px_rgba(201,161,90,0.35)] transition-transform"
        >
          Sākt veidot kastīti
        </motion.a>
      </div>
    </section>
  )
}
