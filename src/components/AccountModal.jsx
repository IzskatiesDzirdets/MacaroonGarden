import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSupabase } from '../hooks/useSupabase'

export default function AccountModal({ isOpen, onClose }) {
  const { sb, user, profile, updateProfile, logout } = useSupabase()
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen && user) {
      setPhone(profile?.phone || '')
      setAddress(profile?.address || '')
      setError('')
      setSuccess(false)
      loadOrderHistory()
    }
  }, [isOpen, user, profile])

  if (!isOpen || !user) return null

  const loadOrderHistory = async () => {
    setOrdersLoading(true)
    try {
      const { data, error: dbErr } = await sb
        .from('macaroon_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('delivery_date', { ascending: false })

      if (dbErr) throw dbErr
      setOrders(data || [])
    } catch (err) {
      console.warn('Failed to load orders:', err.message)
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      await updateProfile(phone, address)
      setSuccess(true)
    } catch {
      setError('Neizdevās saglabāt izmaiņas.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoutClick = async () => {
    try {
      await logout()
      onClose()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
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
          className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-espresso-3 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.65)] ring-1 ring-gold/15"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-ivory-dim transition-colors hover:bg-white/10 hover:text-ivory"
            aria-label="Aizvērt"
          >
            &#x2715;
          </button>

          <div className="flex flex-col gap-1">
            <h2 className="font-display text-2xl font-bold tracking-wide text-ivory">Mans konts 🌷</h2>
            <p className="text-xs text-ivory-dim">Pārvaldi savu profilu un pārskati pasūtījumu vēsturi</p>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {/* Left Column: Profile */}
            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold text-gold">Profila informācija</h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1" htmlFor="ac-name">
                    Vārds
                  </label>
                  <input
                    id="ac-name"
                    type="text"
                    disabled
                    value={user.user_metadata?.full_name || user.email.split('@')[0]}
                    className="w-full rounded-xl border border-white/5 bg-espresso-2/50 px-4 py-2.5 font-body text-sm text-ivory/60 outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1" htmlFor="ac-email">
                    E-pasts
                  </label>
                  <input
                    id="ac-email"
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full rounded-xl border border-white/5 bg-espresso-2/50 px-4 py-2.5 font-body text-sm text-ivory/60 outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1" htmlFor="ac-phone">
                    Tālrunis
                  </label>
                  <input
                    id="ac-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2.5 font-body text-sm text-ivory outline-none transition-all focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
                    placeholder="+371 XXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1" htmlFor="ac-address">
                    Piegādes adrese
                  </label>
                  <input
                    id="ac-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2.5 font-body text-sm text-ivory outline-none transition-all focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
                    placeholder="Iela, māja, pilsēta"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                    ✓ Saglabāts! Informācija atjaunināta.
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-xl bg-gold py-2.5 font-mono text-xs uppercase tracking-widest text-espresso font-bold transition-all hover:bg-gold-soft disabled:opacity-50"
                  >
                    {saving ? 'Saglabā...' : 'Saglabāt'}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogoutClick}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-ivory-dim transition-all hover:bg-white/10 hover:text-ivory"
                  >
                    Iziet
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Order History */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-display text-lg font-semibold text-gold">Pasūtījumu vēsture</h3>

              <div className="flex-1 overflow-y-auto rounded-2xl border border-white/5 bg-espresso-2 p-4 max-h-[300px]">
                {ordersLoading ? (
                  <div className="flex h-full flex-col items-center justify-center space-y-2">
                    <span className="block h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                    <span className="font-mono text-[0.65rem] text-ivory-dim">Ielādē vēsturi...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center py-10 text-ivory-dim space-y-2">
                    <span className="text-2xl">🌸</span>
                    <p className="text-xs">Vēl nav pasūtījumu.</p>
                    <p className="text-[0.65rem] opacity-70">Tavi veiktie pasūtījumi parādīsies šeit.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((o) => (
                      <div key={o.id} className="rounded-xl border border-white/5 bg-espresso-3/60 p-3.5 space-y-1">
                        <div className="flex items-center justify-between font-mono text-[0.65rem] text-gold/85">
                          <span>{o.delivery_date} · {o.delivery_time}</span>
                          <span className="font-body text-xs font-semibold text-blush">{o.quantity} gab.</span>
                        </div>
                        <p className="font-body text-xs font-medium text-ivory line-clamp-1">
                          {o.flavours?.split(',').map(f => {
                            const mapping = {
                              rose: '🌹 Roze un Avenes',
                              choc: '🍫 Beļģu šokolāde',
                              lemon: '🍋 Citronu Kurds',
                              blue: '🫐 Mellenes un Lavanda',
                              pist: '🥜 Pistācija un Vaniļa'
                            };
                            return mapping[f] || f;
                          }).join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
