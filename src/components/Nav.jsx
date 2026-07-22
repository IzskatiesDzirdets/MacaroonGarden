import { motion } from 'framer-motion'

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10"
    >
      <a href="#top" className="flex items-center gap-3">
        <img src="/logo.webp" alt="Macaroon Garden" className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15" />
        <span className="font-display text-lg tracking-wide text-ivory">Macaroon Garden</span>
      </a>

      <motion.a
        href="https://macarongarden.netlify.app/#booking"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="rounded-full border border-gold/40 bg-gold/10 px-5 py-2 font-mono text-xs uppercase tracking-[0.15em] text-gold backdrop-blur-md transition-colors hover:bg-gold/20"
      >
        Pasūtīt
      </motion.a>
    </motion.header>
  )
}
