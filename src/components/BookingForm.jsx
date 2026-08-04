import { useState, useEffect, useCallback, useRef } from 'react'
import { useSupabase } from '../hooks/useSupabase'
import { useCMS } from '../hooks/useCMS'

const FLAVOURS = [
  { id: 'rose',  e: '🌹', n: 'Roze un Avenes' },
  { id: 'choc',  e: '🍫', n: 'Beļģu Šokolāde' },
  { id: 'lemon', e: '🍋', n: 'Citronu Kurds' },
  { id: 'blue',  e: '🫐', n: 'Mellenes un Lavanda' },
  { id: 'pist',  e: '🥜', n: 'Pistācija un Vaniļa' },
]

const TIMES = [
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00'
]
const MAX_ORDERS_PER_BLOCK = 3
const CFG = { minDays: 2, maxDays: 90, maxPerDay: 15 }

function fmtDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function BookingForm({ selectedBoxes = [], setSelectedBoxes }) {
  const { sb, user, profile } = useSupabase()
  const { gameConfig, addInquiry } = useCMS()

  const [cal, setCal] = useState(new Date())
  const [bks, setBks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selDate, setSD] = useState(null)
  const [selFlavs, setSF] = useState([])
  const [selTime, setST] = useState(null)

  // Client info form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [qty, setQty] = useState(12)
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')

  // Reward code and selections (gift/discount)
  const [promoCode, setPromoCode] = useState('')
  const [selectedRewardOption, setSelectedRewardOption] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [boxImported, setBI] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Load bookings from Supabase
  const loadBookings = useCallback(async () => {
    try {
      const { data, error } = await sb
        .from('macaroon_orders')
        .select('delivery_date,delivery_time')
      if (error) throw error
      setBks(data || [])
    } catch (e) {
      console.warn('Failed to load bookings:', e.message)
    } finally {
      setLoading(false)
    }
  }, [sb])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  // Pre-fill fields from Auth profile
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || '')
      setEmail(user.email || '')
      if (profile) {
        setPhone(profile.phone || '')
        setAddress(profile.address || '')
      }
    }
  }, [user, profile])

  // Dynamically compute sum of box sizes when custom boxes are built
  const totalBoxQty = selectedBoxes.reduce((acc, b) => acc + b.size, 0)

  useEffect(() => {
    if (selectedBoxes.length > 0) {
      setQty(totalBoxQty)
      setBI(true)
    } else {
      setBI(false)
    }
  }, [selectedBoxes, totalBoxQty])

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const onDay = (d) => bks.filter((b) => b.delivery_date === d)

  const avail = (day) => {
    const y = cal.getFullYear()
    const m = cal.getMonth()
    const dt = new Date(y, m, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const minD = new Date(today)
    minD.setDate(minD.getDate() + CFG.minDays)

    const maxD = new Date(today)
    maxD.setDate(maxD.getDate() + CFG.maxDays)

    if (dt < minD || dt > maxD) return false
    return onDay(fmtDate(y, m, day)).length < CFG.maxPerDay
  }

  const calInfo = () => {
    const y = cal.getFullYear()
    const m = cal.getMonth()
    const first = new Date(y, m, 1)
    let dow = first.getDay()
    if (dow === 0) dow = 7
    return {
      total: new Date(y, m + 1, 0).getDate(),
      start: dow - 1,
    }
  }

  const handleDropdownToggle = (id) => {
    setSF((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const validate = () => {
    if (!selDate) return 'Lūdzu izvēlieties piegādes datumu!'
    if (!selTime) return 'Lūdzu izvēlieties piegādes laiku!'
    if (selectedBoxes.length === 0 && selFlavs.length === 0) return 'Lūdzu izvēlieties vismaz vienu garšu!'
    if (!name.trim()) return 'Lūdzu ievadiet savu vārdu!'
    if (!email.includes('@')) return 'Lūdzu ievadiet pareizu e-pastu!'
    if (phone.trim().length < 7) return 'Lūdzu ievadiet tālruņa numuru!'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) return setError(validationError)

    setSubmitting(true)
    setError(null)

    try {
      // Serialize customized box content details for database record and transactional email receipt
      let serializedFlavours = selFlavs.join(',')
      let emailFlavoursSummary = selFlavs.map((id) => FLAVOURS.find((f) => f.id === id)?.n || id).join(', ')
      let serializedNotes = notes

      if (selectedBoxes.length > 0) {
        const boxDetailsArr = selectedBoxes.map((boxItem, idx) => {
          const grouped = boxItem.flavors.reduce((acc, f) => {
            acc[f.nm] = (acc[f.nm] || 0) + 1
            return acc
          }, {})
          const breakdownText = Object.entries(grouped)
            .map(([nm, cnt]) => `${nm} x${cnt}`)
            .join(', ')
          return `Kastīte #${idx + 1} (${boxItem.size} gab.): ${breakdownText}`
        })
        serializedFlavours = boxDetailsArr.join(' | ')
        emailFlavoursSummary = boxDetailsArr.join(' | ')
        serializedNotes = `${boxDetailsArr.join('; ')}. ${notes}`
      }

      if (promoCode) {
        serializedNotes += ` [Kods: ${promoCode}, Izvēlētā balva: ${selectedRewardOption || 'nav norādīta'}]`
      }

      // Save order to Supabase
      const { error: dbErr } = await sb.from('macaroon_orders').insert([
        {
          delivery_date: selDate,
          delivery_time: selTime,
          client_name: name.trim(),
          client_email: email.trim().toLowerCase(),
          client_phone: phone.trim(),
          flavours: serializedFlavours,
          quantity: parseInt(qty),
          user_id: user?.id || null,
          notes: (address ? 'Adrese: ' + address + '. ' : '') + serializedNotes,
        },
      ])

      if (dbErr) throw dbErr

      // Register inquiry locally inside CMSProvider as well!
      addInquiry({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        qty: parseInt(qty),
        flavours: emailFlavoursSummary,
        notes: (address ? 'Adrese: ' + address + '. ' : '') + serializedNotes,
      })

      // Dispatch EmailJS
      try {
        if (window.emailjs) {
          await window.emailjs.send('service_d52bopv', 'template_azl3ud8', {
            to_email: email.trim(),
            client_name: name.trim(),
            client_email: email.trim().toLowerCase(),
            client_phone: phone.trim(),
            booking_date: selDate,
            host_name: 'Macaroon Garden',
            event_type: emailFlavoursSummary,
            guest_count: qty,
            notes: `Piegāde: ${selTime}. ${address ? 'Adrese: ' + address : ''} ${notes}`,
          })
        }
      } catch (emailErr) {
        console.warn('Email dispatch failed but order was saved:', emailErr)
      }

      await loadBookings()
      // Success triggers, clear current box cart state as well on successful order submit!
      setSelectedBoxes([])
      setSuccess(true)
    } catch (err) {
      console.error('Submit error:', err)
      setError('Neizdevās nosūtīt pasūtījumu! Lūdzu, sazinieties ar mums Instagram @macarongardenlv')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <span className="block h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        <span className="font-mono text-xs text-gold/80 tracking-widest uppercase">Ielādē kalendāru...</span>
      </div>
    )
  }

  const { total, start } = calInfo()
  const y = cal.getFullYear()
  const m = cal.getMonth()

  return (
    <section id="booking" className="bg-espresso px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">Pasūtījums</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.9rem)] text-ivory">
            Rezervē savu <em className="italic text-blush">saldo mirkli</em>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-ivory-dim">
            Izvēlies piegādes laiku, aizpildi savu informāciju un mēs sagatavosim svaigi ceptus makarūnus tieši tev.
          </p>
        </div>

        {success ? (
          <div className="mx-auto max-w-xl text-center rounded-3xl border border-gold/20 bg-espresso-3 p-8 shadow-2xl ring-1 ring-gold/15">
            <span className="text-4xl block mb-4">🌸</span>
            <h3 className="font-display text-2xl font-bold text-gold">Liels paldies, {name}!</h3>
            <p className="mt-3 text-sm text-ivory-dim leading-relaxed">
              Tavs pasūtījums ir veiksmīgi saņemts! Nosūtījām apstiprinājumu uz tavu e-pastu. Sazināsimies ar tevi 24h laikā.
            </p>
            <div className="my-6 rounded-2xl border border-white/5 bg-espresso-2/40 p-4 space-y-1.5 font-mono text-xs text-gold/85">
              <div>Piegādes datums: <span className="text-ivory font-body font-semibold">{selDate}</span></div>
              <div>Piegādes laiks: <span className="text-ivory font-body font-semibold">{selTime}</span></div>
              <div>Daudzums: <span className="text-ivory font-body font-semibold">{qty} gab.</span></div>
            </div>
            <button
              onClick={() => {
                setSuccess(false)
                setSD(null)
                setST(null)
                setSF([])
                setBI(false)
                setNotes('')
                setPromoCode('')
                setSelectedRewardOption('')
              }}
              className="rounded-full bg-gold/10 border border-gold/30 px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-gold hover:bg-gold/25 transition-all"
            >
              Jauns pasūtījums
            </button>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            {/* Left Column: Calendar & Time */}
            <div className="rounded-2xl border border-white/10 bg-espresso-3/50 p-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-6 text-gold">
                <span className="text-lg">📅</span>
                <h3 className="font-display text-lg font-bold">1. Izvēlies datumu & laiku</h3>
              </div>

              {/* Month Selector */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date(cal)
                    d.setMonth(m - 1)
                    setCal(d)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-ivory transition-colors hover:bg-white/10"
                >
                  &#8249;
                </button>
                <span className="font-display font-semibold text-ivory capitalize">
                  {cal.toLocaleDateString('lv-LV', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date(cal)
                    d.setMonth(m + 1)
                    setCal(d)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-ivory transition-colors hover:bg-white/10"
                >
                  &#8250;
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {['P', 'O', 'T', 'C', 'Pk', 'S', 'Sv'].map((d) => (
                  <div key={d} className="py-2 font-mono text-[0.65rem] uppercase tracking-wider text-gold/60 font-semibold">
                    {d}
                  </div>
                ))}

                {/* Preceding month trailing days */}
                {Array.from({ length: start }).map((_, i) => {
                  const prevM = m === 0 ? 11 : m - 1
                  const prevY = m === 0 ? y - 1 : y
                  const prevDaysTotal = new Date(prevY, prevM + 1, 0).getDate()
                  const day = prevDaysTotal - start + i + 1

                  return (
                    <div
                      key={`prev-${day}`}
                      className="cal-day aspect-square flex flex-col items-center justify-center rounded-lg text-[10px] sm:text-xs font-semibold text-ivory/20 hover:text-gold hover:scale-105 cursor-pointer transition-all"
                      onClick={() => {
                        const nextCal = new Date(cal)
                        nextCal.setMonth(m - 1)
                        setCal(nextCal)
                      }}
                    >
                      <span>{day}</span>
                    </div>
                  )
                })}

                {/* Current month days */}
                {Array.from({ length: total }).map((_, i) => {
                  const day = i + 1
                  const d = fmtDate(y, m, day)
                  const isAvail = avail(day)
                  const cnt = onDay(d).length
                  const isSel = selDate === d
                  const isFull = cnt >= CFG.maxPerDay

                  let cls = 'cal-day aspect-square flex flex-col items-center justify-center rounded-lg text-[10px] sm:text-xs font-semibold transition-all relative cursor-pointer '
                  if (isSel) {
                    cls += 'sel bg-gold text-espresso font-bold scale-105 shadow-md'
                  } else if (isFull) {
                    cls += 'full bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed opacity-50'
                  } else if (isAvail) {
                    cls += 'avail bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 hover:bg-emerald-500/20 hover:scale-105'
                  } else {
                    cls += 'text-ivory/20 cursor-not-allowed pointer-events-none'
                  }

                  return (
                    <div
                      key={day}
                      className={cls}
                      onClick={() => {
                        if (isAvail && !isFull) {
                          setSD(d)
                          setST(null)
                        }
                      }}
                    >
                      <span>{day}</span>
                      {cnt > 0 && !isSel && !isFull && (
                        <div className="absolute bottom-1.5 flex gap-0.5">
                          {Array.from({ length: cnt }).map((_, ci) => (
                            <div key={ci} className="h-1 w-1 rounded-full bg-emerald-400" />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Succeeding month leading days */}
                {Array.from({ length: (7 - ((start + total) % 7)) % 7 }).map((_, i) => {
                  const day = i + 1

                  return (
                    <div
                      key={`next-${day}`}
                      className="cal-day aspect-square flex flex-col items-center justify-center rounded-lg text-[10px] sm:text-xs font-semibold text-ivory/20 hover:text-gold hover:scale-105 cursor-pointer transition-all"
                      onClick={() => {
                        const nextCal = new Date(cal)
                        nextCal.setMonth(m + 1)
                        setCal(nextCal)
                      }}
                    >
                      <span>{day}</span>
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex gap-4 text-[0.65rem] font-mono text-ivory-dim/70">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500/30" />
                  <span>Pieejams</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-red-500/30" />
                  <span>Pilns</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-gold" />
                  <span>Izvēlēts</span>
                </div>
              </div>

              {/* Hourly Time chips - divided into 2-hour blocks with capacity for multiple bookings */}
              {selDate && (
                <div className="mt-8">
                  <label className="block font-mono text-xs uppercase tracking-wider text-gold/80 mb-3">
                    Pieejamie piegādes laiki (2 stundu posmi)
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {TIMES.map((t) => {
                      // Allow up to 3 orders per 2-hour block
                      const count = onDay(selDate).filter((b) => b.delivery_time === t).length
                      const isTaken = count >= MAX_ORDERS_PER_BLOCK
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={isTaken}
                          onClick={() => setST(t)}
                          className={`rounded-lg py-2.5 text-center font-mono text-xs transition-all ${
                            selTime === t
                              ? 'bg-gold text-espresso font-bold shadow-md'
                              : isTaken
                              ? 'bg-red-500/5 text-red-500/30 border border-red-500/10 line-through cursor-not-allowed'
                              : 'bg-white/5 border border-white/5 text-ivory hover:border-gold/40'
                          }`}
                        >
                          <span>{t}</span>
                          {count > 0 && !isTaken && (
                            <span className="block text-[9px] opacity-75 mt-0.5 text-gold">Rezervēts x{count}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Info Form */}
            <div className="rounded-2xl border border-white/10 bg-espresso-3/50 p-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-6 text-gold">
                <span className="text-lg">🌸</span>
                <h3 className="font-display text-lg font-bold">2. Pasūtījuma detaļas</h3>
              </div>

              {selectedBoxes.length > 0 && (
                <div className="mb-4 rounded-xl border border-gold/20 bg-gold/5 p-3.5 text-xs text-gold flex items-center gap-2">
                  <span>🎁</span>
                  <span>Pasūtījuma saturs automātiski ielādēts no kastīšu veidotāja groza!</span>
                </div>
              )}

              {/* Detailed custom boxes breakdown review card */}
              {selectedBoxes.length > 0 && (
                <div className="mb-4 rounded-2xl border border-gold/25 bg-espresso-2/50 p-4 space-y-3">
                  <p className="font-mono text-xs uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                    <span>🎁</span>
                    <span>Tavu izvēlēto kastīšu sastāvs ({selectedBoxes.length}):</span>
                  </p>
                  <div className="space-y-3">
                    {selectedBoxes.map((boxItem, idx) => {
                      // Group and format flavors inside this box
                      const grouped = boxItem.flavors.reduce((acc, f) => {
                        acc[f.nm] = (acc[f.nm] || 0) + 1
                        return acc
                      }, {})
                      const breakdownText = Object.entries(grouped)
                        .map(([nm, cnt]) => `${nm} x${cnt}`)
                        .join(', ')

                      return (
                        <div key={boxItem.id} className="text-xs text-ivory-dim leading-relaxed flex flex-col gap-0.5 border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                          <span className="font-mono text-[9px] text-gold font-bold uppercase">Kastīte #{idx + 1} ({boxItem.size} gab.)</span>
                          <span className="font-medium text-ivory">{breakdownText}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {!selDate && (
                <div className="mb-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center text-xs text-ivory-dim/60">
                  Lūdzu, vispirms izvēlieties piegādes datumu kalendārā pa kreisi
                </div>
              )}

              {selDate && selTime && (
                <div className="mb-4 rounded-xl border border-gold/15 bg-gold/10 p-3 text-center text-xs text-gold font-mono font-semibold">
                  📅 {selDate} · ⏰ {selTime}
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1" htmlFor="bk-name">
                      Vārds *
                    </label>
                    <input
                      id="bk-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2.5 font-body text-sm text-ivory outline-none transition-all focus:border-gold/50"
                      placeholder="Jūsu vārds"
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1" htmlFor="bk-phone">
                      Tālrunis *
                    </label>
                    <input
                      id="bk-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2.5 font-body text-sm text-ivory outline-none transition-all focus:border-gold/50"
                      placeholder="+371 XXXXXXXX"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1" htmlFor="bk-email">
                    E-pasts *
                  </label>
                  <input
                    id="bk-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2.5 font-body text-sm text-ivory outline-none transition-all focus:border-gold/50"
                    placeholder="vards@gmail.com"
                    autoComplete="email"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1" htmlFor="bk-qty">
                      {selectedBoxes.length > 0 ? 'Skaits (bloķēts no groza) 🔒' : 'Skaits (gab.)'}
                    </label>
                    <input
                      id="bk-qty"
                      type="number"
                      min="4"
                      max="200"
                      value={qty}
                      disabled={selectedBoxes.length > 0}
                      onChange={(e) => setQty(e.target.value)}
                      className={`w-full rounded-xl border px-4 py-2.5 font-body text-sm outline-none transition-all focus:border-gold/50 ${
                        selectedBoxes.length > 0
                          ? 'border-white/5 bg-espresso-2/50 text-ivory/60 cursor-not-allowed'
                          : 'border-white/10 bg-espresso-2 text-ivory'
                      }`}
                    />
                  </div>

                  {/* Multi-select Dropdown for Flavours with self-wrapping compact chips */}
                  <div className="relative" ref={dropdownRef}>
                    <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1">
                      Garšas *
                    </label>
                    {selectedBoxes.length > 0 ? (
                      <div className="w-full rounded-xl border border-white/5 bg-espresso-2/50 px-4 py-2.5 text-left font-body text-xs text-ivory/60 min-h-[42px] flex items-center justify-between cursor-not-allowed">
                        <span>Automātiski konfigurēts no groza 🎁</span>
                        <span className="text-[0.65rem] text-gold/50">🔒</span>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2.5 text-left font-body text-sm text-ivory outline-none transition-all focus:border-gold/50 flex items-center justify-between min-h-[42px] cursor-pointer"
                        >
                          {selFlavs.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 py-0.5 max-w-[90%]">
                              {selFlavs.map((id) => {
                                const f = FLAVOURS.find((x) => x.id === id)
                                if (!f) return null
                                const pillColor = {
                                  rose: 'bg-blush/10 text-gold border-blush/20',
                                  choc: 'bg-gold/10 text-gold border-gold/20',
                                  lemon: 'bg-gold/10 text-gold border-gold/20',
                                  blue: 'bg-sage/10 text-gold border-sage/20',
                                  pist: 'bg-sage/10 text-gold border-sage/20',
                                }[id] || 'bg-white/5 border-white/10'

                                return (
                                  <span
                                    key={id}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${pillColor}`}
                                  >
                                    <span>{f.e}</span>
                                    <span className="font-semibold text-[10px] tracking-wide uppercase">{f.n}</span>
                                  </span>
                                )
                              })}
                            </div>
                          ) : (
                            <span className="opacity-50 text-xs">Izvēlēties garšas...</span>
                          )}
                          <span className="text-[0.6rem] text-gold/60 ml-2 flex-shrink-0">&#9660;</span>
                        </button>

                        {dropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-white/10 bg-espresso-3 p-2 shadow-2xl space-y-1 max-h-56 overflow-y-auto">
                            {FLAVOURS.map((f) => {
                              const isSelected = selFlavs.includes(f.id)
                              return (
                                <button
                                  key={f.id}
                                  type="button"
                                  onClick={() => handleDropdownToggle(f.id)}
                                  className={`w-full text-left rounded-lg p-2.5 text-xs font-semibold flex items-center gap-2.5 transition-all ${
                                    isSelected
                                      ? 'bg-gold/15 text-gold font-bold'
                                      : 'text-ivory-dim hover:bg-white/5 hover:text-ivory'
                                  }`}
                                >
                                  <span className="flex h-4 w-4 items-center justify-center rounded border border-white/20 text-[0.6rem]">
                                    {isSelected ? '✓' : ''}
                                  </span>
                                  <span>{f.e}</span>
                                  <span>{f.n}</span>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Claimed Game Reward Coupon input & dynamic options selectors */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1" htmlFor="bk-promo">
                      Dāvanu / Balvas kods
                    </label>
                    <input
                      id="bk-promo"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2.5 font-body text-sm text-ivory outline-none transition-all focus:border-gold/50"
                      placeholder="Piem. GARDEN10"
                    />
                  </div>

                  {promoCode && (
                    <div>
                      <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1">
                        Izvēlies savu balvu 🎁
                      </label>
                      <select
                        value={selectedRewardOption}
                        onChange={(e) => setSelectedRewardOption(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2.5 font-body text-xs text-gold outline-none focus:border-gold/50"
                      >
                        <option value="">Izvēlies opciju...</option>
                        {(gameConfig.rewardOptions || []).map(opt => (
                          <option key={opt.id} value={opt.desc}>
                            {opt.value} ({opt.desc})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1" htmlFor="bk-address">
                    Piegādes adrese
                  </label>
                  <input
                    id="bk-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2.5 font-body text-sm text-ivory outline-none transition-all focus:border-gold/50"
                    placeholder="Iela, māja, dzīvoklis, Rīga"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[0.65rem] uppercase tracking-wider text-gold/80 mb-1" htmlFor="bk-notes">
                    Papildu vēlmes
                  </label>
                  <textarea
                    id="bk-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2.5 font-body text-sm text-ivory outline-none transition-all focus:border-gold/50 resize-y"
                    placeholder="Krāsu vēlmes, dāvanu kartīte, īpašs iepakojums..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !selDate || !selTime || (selectedBoxes.length === 0 && selFlavs.length === 0)}
                  className="w-full mt-4 rounded-full bg-gold py-3.5 font-mono text-xs uppercase tracking-widest text-espresso font-bold shadow-[0_4px_24px_rgba(201,161,90,0.25)] transition-all hover:bg-gold-soft disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="block h-4 w-4 animate-spin rounded-full border-2 border-espresso border-t-transparent" />
                      <span>Apstrādā...</span>
                    </>
                  ) : (
                    '🌸 Nosūtīt pasūtījumu'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
