import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINKS = [
  { href: '#flavours', label: 'Garšas' },
  { href: '#story', label: 'Mūsu stāsts' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-espresso/70 px-6 py-4 backdrop-blur-md md:px-10"
      >
        <a href="#top" className="flex items-center gap-3">
          <img src="/logo.webp" alt="Macaroon Garden" className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15" />
          <span className="font-display text-lg tracking-wide text-ivory">Macaroon Garden</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs uppercase tracking-[0.15em] text-ivory-dim transition-colors hover:text-ivory"
            >
              {l.label}
            </a>
          ))}
          <motion.a
            href="https://macarongarden.netlify.app/#booking"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full border border-gold/40 bg-gold/10 px-5 py-2 font-mono text-xs uppercase tracking-[0.15em] text-gold backdrop-blur-md transition-colors hover:bg-gold/20"
          >
            Pasūtīt
          </motion.a>
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Izvēlne"
          aria-expanded={open}
          className="flex flex-col gap-1.5 p-2 md:hidden"
        >
          <span className={`h-px w-6 bg-ivory transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-px w-6 bg-ivory transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`h-px w-6 bg-ivory transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-espresso md:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-3xl text-ivory hover:text-blush"
              >
                {l.label}
              </a>
            ))}
            <a
              href="https://macarongarden.netlify.app/#booking"
              onClick={() => setOpen(false)}
              className="rounded-full bg-gold px-8 py-3 font-mono text-xs uppercase tracking-[0.15em] text-espresso"
            >
              Pasūtīt
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
