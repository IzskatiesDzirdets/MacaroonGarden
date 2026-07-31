import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSupabase } from '../hooks/useSupabase'

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const { login, register, updateProfile } = useSupabase()
  const [tab, setTab] = useState(initialTab) // 'login' | 'register' | 'profile'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Form states
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab)
      setError('')
      setSuccess(false)
      setFullName('')
      setEmail('')
      setPassword('')
      setPhone('')
      setAddress('')
    }
  }, [isOpen, initialTab])

  if (!isOpen) return null

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) return setError('Lūdzu aizpildiet visus laukus.')
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      onClose()
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Nepareizs e-pasts vai parole.' : err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!fullName || !email || !password) return setError('Lūdzu aizpildiet visus laukus.')
    if (password.length < 6) return setError('Parolei jābūt vismaz 6 simboliem.')
    setLoading(true)
    setError('')
    try {
      const data = await register(email, password, fullName)
      if (data?.user) {
        setTab('profile')
      }
    } catch (err) {
      setError(err.message === 'User already registered' ? 'Šis e-pasts jau ir reģistrēts.' : err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await updateProfile(phone, address)
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch {
      setError('Neizdevās saglabāt profilu, mēģiniet vēlreiz.')
    } finally {
      setLoading(false)
    }
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 350 } },
  }

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-espresso/80 p-4 backdrop-blur-md"
      >
        <motion.div
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-espresso-3 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.65)] ring-1 ring-gold/15"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-ivory-dim transition-colors hover:bg-white/10 hover:text-ivory"
            aria-label="Aizvērt"
          >
            &#x2715;
          </button>

          {tab !== 'profile' && (
            <div className="mb-6 flex justify-center gap-2 rounded-xl bg-espresso-2 p-1">
              <button
                onClick={() => { setTab('login'); setError(''); }}
                className={`flex-1 rounded-lg py-2 font-mono text-xs uppercase tracking-wider transition-all ${
                  tab === 'login' ? 'bg-gold text-espresso font-semibold' : 'text-ivory-dim hover:text-ivory'
                }`}
              >
                Ieiet
              </button>
              <button
                onClick={() => { setTab('register'); setError(''); }}
                className={`flex-1 rounded-lg py-2 font-mono text-xs uppercase tracking-wider transition-all ${
                  tab === 'register' ? 'bg-gold text-espresso font-semibold' : 'text-ivory-dim hover:text-ivory'
                }`}
              >
                Reģistrēties
              </button>
            </div>
          )}

          <h2 className="font-display text-2xl font-bold tracking-wide text-ivory">
            {tab === 'login' && 'Sveicināti atpakaļ 🌸'}
            {tab === 'register' && 'Izveidot kontu 🌿'}
            {tab === 'profile' && 'Gandrīz gatavs 🌷'}
          </h2>
          <p className="mt-1 text-xs text-ivory-dim">
            {tab === 'login' && 'Piesakies, lai izsekotu saviem pasūtījumiem'}
            {tab === 'register' && 'Reģistrējies un saņem -10% savam pirmajam pasūtījumam!'}
            {tab === 'profile' && 'Saglabā savu piegādes informāciju ātrākai pasūtīšanai'}
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
              ✓ Saglabāts! Laipni lūdzam Macaroon Garden!
            </div>
          )}

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1.5" htmlFor="login-email">
                  E-pasts
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-3 font-body text-sm text-ivory outline-none transition-all focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
                  placeholder="vards@gmail.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1.5" htmlFor="login-password">
                  Parole
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-3 font-body text-sm text-ivory outline-none transition-all focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-xl bg-gold py-3.5 font-mono text-xs uppercase tracking-widest text-espresso font-bold transition-all hover:bg-gold-soft disabled:opacity-50"
              >
                {loading ? 'Lūdzu uzgaidiet...' : 'Ieiet kontā'}
              </button>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <div>
                <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1.5" htmlFor="reg-name">
                  Vārds
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-3 font-body text-sm text-ivory outline-none transition-all focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
                  placeholder="Tavs Vārds"
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1.5" htmlFor="reg-email">
                  E-pasts
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-3 font-body text-sm text-ivory outline-none transition-all focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
                  placeholder="vards@gmail.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1.5" htmlFor="reg-password">
                  Parole
                </label>
                <input
                  id="reg-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-3 font-body text-sm text-ivory outline-none transition-all focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
                  placeholder="Vismaz 6 simboli"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-xl bg-gold py-3.5 font-mono text-xs uppercase tracking-widest text-espresso font-bold transition-all hover:bg-gold-soft disabled:opacity-50"
              >
                {loading ? 'Lūdzu uzgaidiet...' : 'Izveidot kontu 🌿'}
              </button>
            </form>
          )}

          {tab === 'profile' && (
            <form onSubmit={handleProfile} className="mt-6 space-y-4">
              <div>
                <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1.5" htmlFor="prof-phone">
                  Tālrunis
                </label>
                <input
                  id="prof-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-3 font-body text-sm text-ivory outline-none transition-all focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
                  placeholder="+371 XXXXXXXX"
                  autoComplete="tel"
                />
              </div>

              <div>
                <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1.5" htmlFor="prof-address">
                  Piegādes adrese
                </label>
                <input
                  id="prof-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-3 font-body text-sm text-ivory outline-none transition-all focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
                  placeholder="Iela, māja, pilsēta"
                  autoComplete="street-address"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-xl bg-gold py-3.5 font-mono text-xs uppercase tracking-widest text-espresso font-bold transition-all hover:bg-gold-soft disabled:opacity-50"
              >
                {loading ? 'Lūdzu uzgaidiet...' : 'Saglabāt un turpināt 🌷'}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-xs font-mono text-ivory-dim underline hover:text-ivory pt-2"
              >
                Izlaist šo soli
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
