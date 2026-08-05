import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSupabase } from '../hooks/useSupabase'

const LINKS = [
  { href: '#flavours', label: 'Garšas' },
  { href: '#builder', label: 'Kastīte' },
  { href: '#booking', label: 'Pasūtīt' },
  { href: '#game', label: '🍬 Spēle' },
  { href: '#contact', label: 'Kontakti' },
]

export default function Nav({ onAuthOpen, onAccountOpen, onAdminOpen }) {
  const [open, setOpen] = useState(false)
  const { user, logout } = useSupabase()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const initial = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email ? user.email.slice(0, 2).toUpperCase() : 'U'

  const firstName = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ')[0]
    : user?.email ? user.email.split('@')[0] : 'Profils'

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-espresso/70 px-6 py-4 backdrop-blur-md md:px-10"
      >
        <a href="#top" className="flex items-center gap-3 group">
          <img src="/assets/logo.webp" alt="Macaroon Garden" className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-4deg]" />
          <span className="font-display text-lg tracking-wide text-ivory">Macaroon Garden</span>
        </a>

        {/* Desktop Links */}
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

          <button
            onClick={onAdminOpen}
            className="font-mono text-xs uppercase tracking-[0.15em] text-gold/80 transition-colors hover:text-gold cursor-pointer"
          >
            Admin
          </button>

          <span className="h-4 w-px bg-white/10" />

          {user ? (
            <div className="flex items-center gap-4">
              <button
                onClick={onAccountOpen}
                className="flex items-center gap-2 group text-left cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-gold to-blush text-xs font-bold text-espresso shadow-md ring-1 ring-white/10 transition-transform group-hover:scale-105">
                  {initial}
                </div>
                <span className="font-mono text-xs uppercase tracking-wider text-ivory group-hover:text-gold transition-colors">
                  {firstName}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="font-mono text-[0.65rem] uppercase tracking-widest text-ivory-dim/60 transition-colors hover:text-blush"
              >
                Iziet
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onAuthOpen('login')}
                className="font-mono text-xs uppercase tracking-[0.15em] text-ivory-dim transition-colors hover:text-ivory"
              >
                Ieiet
              </button>
              <motion.button
                onClick={() => onAuthOpen('register')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border border-gold/45 bg-gold/10 px-5 py-2 font-mono text-xs uppercase tracking-[0.15em] text-gold backdrop-blur-md transition-colors hover:bg-gold/25"
              >
                Reģistrēties
              </motion.button>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger */}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-45 flex flex-col items-center justify-center gap-8 bg-espresso md:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-2xl text-ivory hover:text-blush transition-colors"
              >
                {l.label}
              </a>
            ))}

            <button
              onClick={() => { setOpen(false); onAdminOpen(); }}
              className="font-display text-2xl text-gold hover:text-gold-soft transition-colors cursor-pointer"
            >
              Admin Panelis
            </button>

            <span className="h-px w-16 bg-white/10" />

            {user ? (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => { setOpen(false); onAccountOpen(); }}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-gold to-blush text-sm font-bold text-espresso">
                    {initial}
                  </div>
                  <span className="font-mono text-sm uppercase tracking-wider text-ivory">
                    {firstName}
                  </span>
                </button>
                <button
                  onClick={() => { setOpen(false); handleLogout(); }}
                  className="font-mono text-xs uppercase tracking-widest text-blush"
                >
                  Iziet no konta
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => { setOpen(false); onAuthOpen('login'); }}
                  className="font-display text-xl text-ivory hover:text-gold"
                >
                  Ieiet
                </button>
                <button
                  onClick={() => { setOpen(false); onAuthOpen('register'); }}
                  className="rounded-full bg-gold px-8 py-3 font-mono text-xs uppercase tracking-[0.15em] text-espresso font-semibold shadow-lg"
                >
                  Reģistrēties
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
