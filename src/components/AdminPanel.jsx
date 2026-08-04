import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCMS } from '../hooks/useCMS'

export default function AdminPanel({ isOpen, onClose }) {
  const {
    adminUser,
    adminList,
    cmsContent,
    flavoursList,
    moodButtons,
    sectionsList,
    galleryList,
    gameConfig,
    rewardCodes,
    inquiries,
    analytics,
    loginAdmin,
    logoutAdmin,
    resetPasswordRequest,
    inviteAdmin,
    removeAdmin,
    updateCMSContent,
    saveFlavour,
    deleteFlavour,
    saveMoodButton,
    deleteMoodButton,
    saveGalleryImage,
    deleteGalleryImage,
    saveSectionList,
    saveGameConfig,
    updateInquiryStatus,
    deleteInquiry
  } = useCMS()

  // Tab: 'sections' | 'text' | 'flavours' | 'moods' | 'gallery_tab' | 'game' | 'inquiries' | 'admins'
  const [activeTab, setActiveTab] = useState('sections')
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [showForgot, setShowForgot] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')

  // CMS Content Local State for currently selected edit section
  const [cmsSection, setCmsSection] = useState('hero')

  // CRUD Forms States
  const [editingFlavour, setEditingFlavour] = useState(null)
  const [editingMood, setEditingMood] = useState(null)
  const [editingGallery, setEditingGallery] = useState(null)
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminRole, setNewAdminRole] = useState('Editor')

  // Achievement Configuration state
  const [quizMilestone, setQuizMilestone] = useState(gameConfig.quizMilestone || 3)
  const [scoreMilestone, setScoreMilestone] = useState(gameConfig.scoreMilestone || 3500)
  const [levelMilestone, setLevelMilestone] = useState(gameConfig.levelMilestone || 15)
  const [useTimeLimit, setUseTimeLimit] = useState(gameConfig.useTimeLimit || false)
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(gameConfig.timeLimitSeconds || 60)

  // Custom Reward Options Builder
  const [newRewardType, setNewRewardType] = useState('gift_ribbon')
  const [newRewardValue, setNewRewardValue] = useState('')
  const [newRewardDesc, setNewRewardDesc] = useState('')

  if (!isOpen) return null

  // Authentication Handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')
    try {
      const res = await loginAdmin(loginUsername, loginPassword)
      if (res.success) {
        setAuthSuccess('✓ Sekmīgi autorizējies!')
        setLoginUsername('')
        setLoginPassword('')
      }
    } catch (err) {
      setAuthError(err.message)
    }
  }

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')
    try {
      const res = await resetPasswordRequest(resetEmail)
      if (res.success) {
        setAuthSuccess(res.message)
        setResetEmail('')
        setTimeout(() => setShowForgot(false), 3000)
      }
    } catch (err) {
      setAuthError(err.message)
    }
  }

  const handleInviteAdminSubmit = (e) => {
    e.preventDefault()
    try {
      inviteAdmin(newAdminName, newAdminEmail, newAdminRole)
      setNewAdminName('')
      setNewAdminEmail('')
      alert('✓ Administrators uzaicināts veiksmīgi!')
    } catch (err) {
      alert(err.message)
    }
  }

  // Section Management Arrow Helpers
  const moveSection = (idx, direction) => {
    const newList = [...sectionsList]
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= newList.length) return
    const temp = newList[idx]
    newList[idx] = newList[targetIdx]
    newList[targetIdx] = temp
    saveSectionList(newList)
  }

  const toggleSectionVisibility = (id) => {
    const newList = sectionsList.map(s => s.id === id ? { ...s, visible: !s.visible } : s)
    saveSectionList(newList)
  }

  // FileReader helper to convert uploaded files directly to Base64
  const handleFileChange = (e, callback) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      callback(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Flavour CRUD Helpers
  const handleSaveFlavourSubmit = (e) => {
    e.preventDefault()
    if (!editingFlavour.name || !editingFlavour.id) return alert('Lūdzu ievadiet nosaukumu un ID.')
    saveFlavour(editingFlavour)
    setEditingFlavour(null)
    alert('✓ Makarūna garša saglabāta!')
  }

  const startNewFlavour = () => {
    setEditingFlavour({
      id: 'id-' + Math.random().toString(36).substring(2, 5),
      name: '',
      note: '',
      ingredients: '',
      price: 2.20,
      badge: '',
      image: '/images/flavours/rose-aveni.png',
      tone: 'gold',
      hidden: false
    })
  }

  // Gallery CRUD Helpers
  const handleSaveGallerySubmit = (e) => {
    e.preventDefault()
    if (!editingGallery.image) return alert('Lūdzu izvēlieties vai augšupielādējiet attēlu.')
    saveGalleryImage(editingGallery)
    setEditingGallery(null)
    alert('✓ Galerijas attēls pievienots!')
  }

  const startNewGalleryImage = () => {
    setEditingGallery({
      id: 'gallery-' + Math.random().toString(36).substring(2, 5),
      caption: '',
      image: ''
    })
  }

  // Mood Customization Helpers
  const handleSaveMoodSubmit = (e) => {
    e.preventDefault()
    if (!editingMood.label || !editingMood.id) return alert('Lūdzu aizpildiet visus laukus.')
    saveMoodButton(editingMood)
    setEditingMood(null)
    alert('✓ Noskaņas poga saglabāta!')
  }

  const startNewMood = () => {
    setEditingMood({
      id: 'mood-' + Math.random().toString(36).substring(2, 5),
      label: '',
      category: 'all',
      highlightColor: '#D9A441',
      order: moodButtons.length + 1
    })
  }

  const handleSaveGameMilestones = () => {
    saveGameConfig({
      ...gameConfig,
      quizMilestone: parseInt(quizMilestone),
      scoreMilestone: parseInt(scoreMilestone),
      levelMilestone: parseInt(levelMilestone),
      useTimeLimit,
      timeLimitSeconds: parseInt(timeLimitSeconds)
    })
    alert('✓ Spēles sasniegumu konfigurācija saglabāta!')
  }

  const handleAddRewardOption = (e) => {
    e.preventDefault()
    if (!newRewardValue || !newRewardDesc) return alert('Lūdzu aizpildiet visus laukus.')
    const updatedOptions = [
      ...(gameConfig.rewardOptions || []),
      {
        id: 'opt-' + Math.random().toString(36).substring(2, 5),
        type: newRewardType,
        value: newRewardValue,
        desc: newRewardDesc
      }
    ]
    saveGameConfig({ ...gameConfig, rewardOptions: updatedOptions })
    setNewRewardValue('')
    setNewRewardDesc('')
    alert('✓ Jauna balvas opcija pievienota!')
  }

  const handleDeleteRewardOption = (id) => {
    const updatedOptions = (gameConfig.rewardOptions || []).filter(o => o.id !== id)
    saveGameConfig({ ...gameConfig, rewardOptions: updatedOptions })
  }

  // Export Utilities
  const exportToCSV = (data, filename) => {
    if (!data || !data.length) return alert('Nav datu eksportēšanai.')
    const keys = Object.keys(data[0])
    const csvContent = "data:text/csv;charset=utf-8,"
      + [keys.join(","), ...data.map(item => keys.map(k => `"${String(item[k]).replace(/"/g, '""')}"`).join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${filename}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToJSON = (data, filename) => {
    if (!data) return alert('Nav datu eksportēšanai.')
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`
    const link = document.createElement("a")
    link.setAttribute("href", jsonString)
    link.setAttribute("download", `${filename}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-espresso/90 p-4 backdrop-blur-lg overflow-y-auto font-body">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-6xl min-h-[80vh] max-h-[90vh] flex flex-col rounded-3xl border border-white/10 bg-espresso-3 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
        >
          {/* Header */}
          <div className="flex justify-between items-center bg-espresso-2 border-b border-white/5 p-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎩</span>
              <div>
                <h1 className="font-display text-xl font-bold tracking-wide text-ivory">Luksusa Vadības Panelis</h1>
                <p className="text-[10px] font-mono text-gold/80 uppercase tracking-widest mt-0.5">Admin Control & CMS</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {adminUser && (
                <div className="flex items-center gap-2.5 rounded-full bg-white/5 px-4 py-2 border border-white/5">
                  <div className="h-5 w-5 rounded-full bg-gold text-[10px] font-bold text-espresso flex items-center justify-center font-mono">
                    {adminUser.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-mono text-xs text-ivory font-semibold">{adminUser.name} ({adminUser.role})</span>
                  <button onClick={logoutAdmin} className="text-[10px] font-mono text-blush underline hover:text-blush-soft ml-2 cursor-pointer">Iziet</button>
                </div>
              )}
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-ivory-dim transition-colors hover:bg-white/10 hover:text-ivory cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {!adminUser ? (
            /* Authentication Panel */
            <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto w-full">
              <div className="w-full rounded-2xl border border-white/5 bg-espresso-2/40 p-8 shadow-xl">
                {!showForgot ? (
                  <>
                    <h2 className="font-display text-xl font-bold text-ivory text-center mb-1">Autorizācija 🔑</h2>
                    <p className="text-xs text-ivory-dim text-center mb-6">Piekļuve dāvanu ateljē vadības centram</p>

                    {authError && (
                      <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-xs text-red-400">
                        {authError}
                      </div>
                    )}
                    {authSuccess && (
                      <div className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                        {authSuccess}
                      </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-gold/80 mb-1" htmlFor="adm-user">Lietotājvārds / E-pasts</label>
                        <input
                          id="adm-user"
                          type="text"
                          required
                          value={loginUsername}
                          onChange={(e) => setLoginUsername(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-espresso px-4 py-3 text-sm text-ivory outline-none focus:border-gold/50"
                          placeholder="janiszacs vai e-pasts"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-gold/80 mb-1" htmlFor="adm-pass">Parole</label>
                        <input
                          id="adm-pass"
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-espresso px-4 py-3 text-sm text-ivory outline-none focus:border-gold/50"
                          placeholder="••••••••"
                        />
                      </div>
                      <button type="submit" className="w-full py-3 rounded-xl bg-gold text-espresso font-mono text-xs uppercase tracking-wider font-bold transition-transform hover:scale-[1.02] cursor-pointer">
                        Ieiet panelī
                      </button>
                    </form>
                    <button onClick={() => setShowForgot(true)} className="w-full text-center text-[11px] font-mono text-gold/60 hover:text-gold mt-4 underline block cursor-pointer">
                      Aizmirsu paroli?
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="font-display text-xl font-bold text-ivory text-center mb-1">Atjaunot paroli ✉️</h2>
                    <p className="text-xs text-ivory-dim text-center mb-6">Instrukcijas tiks nosūtītas uz reģistrēto e-pastu</p>

                    {authError && (
                      <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-xs text-red-400">
                        {authError}
                      </div>
                    )}
                    {authSuccess && (
                      <div className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                        {authSuccess}
                      </div>
                    )}

                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-gold/80 mb-1" htmlFor="recover-email">E-pasts</label>
                        <input
                          id="recover-email"
                          type="email"
                          required
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-espresso px-4 py-3 text-sm text-ivory outline-none focus:border-gold/50"
                          placeholder="janiszacs@gmail.com"
                        />
                      </div>
                      <button type="submit" className="w-full py-3 rounded-xl bg-gold text-espresso font-mono text-xs uppercase tracking-wider font-bold transition-transform hover:scale-[1.02] cursor-pointer">
                        Sūtīt pieprasījumu
                      </button>
                    </form>
                    <button onClick={() => { setShowForgot(false); setAuthError(''); setAuthSuccess(''); }} className="w-full text-center text-[11px] font-mono text-gold/60 hover:text-gold mt-4 underline block cursor-pointer">
                      Atpakaļ uz pieteikšanos
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Main Admin Dashboard Workspace */
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar Menu */}
              <div className="w-56 bg-espresso-2 border-r border-white/5 p-4 flex flex-col gap-1.5 overflow-y-auto">
                <p className="font-mono text-[9px] uppercase tracking-widest text-gold/50 px-3 mb-2">Vadība</p>
                <button
                  onClick={() => setActiveTab('sections')}
                  className={`w-full text-left rounded-xl px-4 py-3 font-mono text-xs tracking-wider transition-all cursor-pointer ${
                    activeTab === 'sections' ? 'bg-gold text-espresso font-bold' : 'text-ivory-dim hover:bg-white/5 hover:text-ivory'
                  }`}
                >
                  🧱 Sadaļas (Order)
                </button>
                <button
                  onClick={() => setActiveTab('text')}
                  className={`w-full text-left rounded-xl px-4 py-3 font-mono text-xs tracking-wider transition-all cursor-pointer ${
                    activeTab === 'text' ? 'bg-gold text-espresso font-bold' : 'text-ivory-dim hover:bg-white/5 hover:text-ivory'
                  }`}
                >
                  📝 CMS Teksti
                </button>
                <button
                  onClick={() => setActiveTab('flavours')}
                  className={`w-full text-left rounded-xl px-4 py-3 font-mono text-xs tracking-wider transition-all cursor-pointer ${
                    activeTab === 'flavours' ? 'bg-gold text-espresso font-bold' : 'text-ivory-dim hover:bg-white/5 hover:text-ivory'
                  }`}
                >
                  🧁 Garšu saraksts
                </button>
                <button
                  onClick={() => setActiveTab('moods')}
                  className={`w-full text-left rounded-xl px-4 py-3 font-mono text-xs tracking-wider transition-all cursor-pointer ${
                    activeTab === 'moods' ? 'bg-gold text-espresso font-bold' : 'text-ivory-dim hover:bg-white/5 hover:text-ivory'
                  }`}
                >
                  🌈 Noskaņu pogas
                </button>
                <button
                  onClick={() => setActiveTab('gallery_tab')}
                  className={`w-full text-left rounded-xl px-4 py-3 font-mono text-xs tracking-wider transition-all cursor-pointer ${
                    activeTab === 'gallery_tab' ? 'bg-gold text-espresso font-bold' : 'text-ivory-dim hover:bg-white/5 hover:text-ivory'
                  }`}
                >
                  🖼️ Galerijas tēli
                </button>
                <button
                  onClick={() => setActiveTab('game')}
                  className={`w-full text-left rounded-xl px-4 py-3 font-mono text-xs tracking-wider transition-all cursor-pointer ${
                    activeTab === 'game' ? 'bg-gold text-espresso font-bold' : 'text-ivory-dim hover:bg-white/5 hover:text-ivory'
                  }`}
                >
                  🍬 Spēle & Balvas
                </button>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`w-full text-left rounded-xl px-4 py-3 font-mono text-xs tracking-wider transition-all cursor-pointer ${
                    activeTab === 'inquiries' ? 'bg-gold text-espresso font-bold' : 'text-ivory-dim hover:bg-white/5 hover:text-ivory'
                  }`}
                >
                  ✉️ Pasūtījumi ({inquiries.length})
                </button>

                <div className="h-px bg-white/5 my-3" />
                <p className="font-mono text-[9px] uppercase tracking-widest text-gold/50 px-3 mb-2">Administrācija</p>

                <button
                  onClick={() => setActiveTab('admins')}
                  className={`w-full text-left rounded-xl px-4 py-3 font-mono text-xs tracking-wider transition-all cursor-pointer ${
                    activeTab === 'admins' ? 'bg-gold text-espresso font-bold' : 'text-ivory-dim hover:bg-white/5 hover:text-ivory'
                  }`}
                >
                  👥 Admini ({adminList.length + 1})
                </button>
              </div>

              {/* View Workspace */}
              <div className="flex-1 p-8 overflow-y-auto bg-espresso-3">
                {/* TAB: SECTIONS */}
                {activeTab === 'sections' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-ivory">Sadaļu izkārtojums un Redzamība</h2>
                      <p className="text-xs text-ivory-dim mt-1 font-semibold">Reorganizējiet, kārtojiet vai noslēpiet landing page sadaļas. Izmaiņas ir uzreiz redzamas tiešsaistē.</p>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-espresso-2/50 overflow-hidden divide-y divide-white/5">
                      {sectionsList
                        .sort((a, b) => a.order - b.order)
                        .map((sec, idx) => (
                          <div key={sec.id} className="flex items-center justify-between p-4 bg-espresso-3/10 hover:bg-white/[0.01]">
                            <div className="flex items-center gap-4">
                              <span className="font-mono text-xs text-gold/50">#{idx + 1}</span>
                              <div>
                                <h3 className="font-mono text-sm text-ivory font-semibold">{sec.name}</h3>
                                <span className="text-[10px] font-mono text-ivory-dim/50">Kods: {sec.id}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => toggleSectionVisibility(sec.id)}
                                className={`rounded-full px-3 py-1 font-mono text-[10px] tracking-wide uppercase transition-colors cursor-pointer ${
                                  sec.visible ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}
                              >
                                {sec.visible ? 'Redzams' : 'Slēpts'}
                              </button>

                              <div className="flex items-center gap-1">
                                <button
                                  disabled={idx === 0}
                                  onClick={() => moveSection(idx, 'up')}
                                  className="h-8 w-8 rounded bg-white/5 hover:bg-white/10 text-ivory flex items-center justify-center disabled:opacity-35 disabled:pointer-events-none cursor-pointer"
                                >
                                  ▲
                                </button>
                                <button
                                  disabled={idx === sectionsList.length - 1}
                                  onClick={() => moveSection(idx, 'down')}
                                  className="h-8 w-8 rounded bg-white/5 hover:bg-white/10 text-ivory flex items-center justify-center disabled:opacity-35 disabled:pointer-events-none cursor-pointer"
                                >
                                  ▼
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* TAB: CMS TEXT */}
                {activeTab === 'text' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-ivory font-bold">Mājaslapas Tekstu CMS</h2>
                        <p className="text-xs text-ivory-dim mt-1">Izvēlieties sadaļu, lai rediģētu tās virsrakstus, aprakstus un aicinājumu pogas.</p>
                      </div>

                      <select
                        value={cmsSection}
                        onChange={(e) => setCmsSection(e.target.value)}
                        className="rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-sm text-gold outline-none"
                      >
                        <option value="hero">Hero (Galvene)</option>
                        <option value="about">Par Mums (Our Story)</option>
                        <option value="flavours">Garšas (Flavours Text)</option>
                        <option value="boxBuilder">Kastīšu Konstruktors (Box Builder)</option>
                        <option value="process">Process (How it works)</option>
                        <option value="faq">FAQ (Biežākie jautājumi)</option>
                        <option value="contact">Kontakti</option>
                        <option value="footer">Footer (Kājene)</option>
                      </select>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-espresso-2/30 p-6 space-y-4">
                      {Object.keys(cmsContent[cmsSection] || {}).map((fieldKey) => (
                        <div key={fieldKey}>
                          <label htmlFor={fieldKey} className="block font-mono text-[10px] uppercase tracking-wider text-gold/80 mb-1.5 font-bold">
                            {fieldKey.replace(/([A-Z])/g, ' $1')}
                          </label>
                          {cmsContent[cmsSection][fieldKey].length > 60 ? (
                            <textarea
                              id={fieldKey}
                              value={cmsContent[cmsSection][fieldKey]}
                              onChange={(e) => updateCMSContent(cmsSection, fieldKey, e.target.value)}
                              rows={3}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-4 py-3 text-sm text-ivory outline-none focus:border-gold/50"
                            />
                          ) : (
                            <input
                              id={fieldKey}
                              type="text"
                              value={cmsContent[cmsSection][fieldKey]}
                              onChange={(e) => updateCMSContent(cmsSection, fieldKey, e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-4 py-3 text-sm text-ivory outline-none focus:border-gold/50"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: FLAVOURS LIST */}
                {activeTab === 'flavours' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-ivory font-bold">Produktu & Garšu Pārvaldība</h2>
                        <p className="text-xs text-ivory-dim mt-1">Pievienojiet jaunas garšas, mainiet cenas, aprakstus, vai paslēpiet produktus.</p>
                      </div>

                      <button
                        onClick={startNewFlavour}
                        className="rounded-full bg-gold px-5 py-2 font-mono text-xs uppercase tracking-wider text-espresso font-bold transition-all hover:bg-gold-soft cursor-pointer"
                      >
                        + Pievienot garšu
                      </button>
                    </div>

                    {/* Editor Form Modal or inline box */}
                    {editingFlavour && (
                      <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 space-y-4">
                        <h3 className="font-display text-lg font-bold text-gold">Rediģēt Makarūnu: {editingFlavour.name || 'Jauns'}</h3>
                        <form onSubmit={handleSaveFlavourSubmit} className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Unikāls ID *</label>
                            <input
                              type="text"
                              required
                              value={editingFlavour.id}
                              onChange={(e) => setEditingFlavour({ ...editingFlavour, id: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-3 py-2 text-xs text-ivory"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Nosaukums *</label>
                            <input
                              type="text"
                              required
                              value={editingFlavour.name}
                              onChange={(e) => setEditingFlavour({ ...editingFlavour, name: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-3 py-2 text-xs text-ivory"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Cena (€)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={editingFlavour.price}
                              onChange={(e) => setEditingFlavour({ ...editingFlavour, price: parseFloat(e.target.value) })}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-3 py-2 text-xs text-ivory"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Badge (Piezīme)</label>
                            <input
                              type="text"
                              value={editingFlavour.badge}
                              onChange={(e) => setEditingFlavour({ ...editingFlavour, badge: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-3 py-2 text-xs text-ivory"
                              placeholder="Populārs / Klasika"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Apraksts</label>
                            <input
                              type="text"
                              value={editingFlavour.note}
                              onChange={(e) => setEditingFlavour({ ...editingFlavour, note: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-3 py-2 text-xs text-ivory"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Sastāvdaļas</label>
                            <textarea
                              value={editingFlavour.ingredients}
                              onChange={(e) => setEditingFlavour({ ...editingFlavour, ingredients: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-3 py-2 text-xs text-ivory"
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Krāsas tēma</label>
                            <select
                              value={editingFlavour.tone}
                              onChange={(e) => setEditingFlavour({ ...editingFlavour, tone: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-3 py-2 text-xs text-ivory"
                            >
                              <option value="blush">Rose (Rozā)</option>
                              <option value="gold">Gold (Zelts)</option>
                              <option value="sage">Sage (Zaļgans)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Attēla augšupielāde (no datora vai telefona) 📷</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, (base64) => setEditingFlavour({ ...editingFlavour, image: base64 }))}
                              className="w-full font-mono text-xs text-ivory"
                            />
                            {editingFlavour.image && (
                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-[10px] text-ivory-dim">Pašreizējā bilde:</span>
                                <img src={editingFlavour.image} className="h-10 w-10 object-cover rounded border border-white/10" alt="Priekšskatījums" />
                              </div>
                            )}
                          </div>

                          <div className="sm:col-span-2 flex justify-end gap-2.5 pt-2">
                            <button
                              type="button"
                              onClick={() => setEditingFlavour(null)}
                              className="rounded-xl bg-white/5 px-4 py-2 font-mono text-xs text-ivory hover:bg-white/10 cursor-pointer"
                            >
                              Atcelt
                            </button>
                            <button
                              type="submit"
                              className="rounded-xl bg-gold px-5 py-2 font-mono text-xs text-espresso font-bold hover:bg-gold-soft cursor-pointer"
                            >
                              Saglabāt
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {flavoursList.map((f) => (
                        <div key={f.id} className="relative rounded-2xl border border-white/10 bg-espresso-2/40 p-4 flex flex-col justify-between">
                          <div className="flex gap-3">
                            <img
                              src={f.image}
                              alt={f.name}
                              onError={(e) => { e.target.onerror = null; e.target.src = '/assets/logo.webp' }}
                              className="h-14 w-14 rounded-xl object-cover border border-white/5 bg-espresso flex-shrink-0"
                            />
                            <div>
                              <h3 className="font-display font-semibold text-ivory leading-tight font-bold">{f.name}</h3>
                              <span className="font-mono text-[10px] text-gold/80 uppercase font-bold">{f.price.toFixed(2)} €</span>
                              {f.badge && <span className="ml-2 bg-gold/10 text-gold text-[8px] font-mono uppercase px-1.5 py-0.5 rounded border border-gold/25 font-bold">{f.badge}</span>}
                              <p className="text-[10px] text-ivory-dim leading-snug mt-1.5">{f.note}</p>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-white/5">
                            <button
                              onClick={() => setEditingFlavour(f)}
                              className="rounded px-2.5 py-1 bg-white/5 text-[10px] font-mono text-gold hover:bg-white/10 cursor-pointer"
                            >
                              Labot
                            </button>
                            <button
                              onClick={() => { if (confirm('Dzēst šo garšu?')) deleteFlavour(f.id) }}
                              className="rounded px-2.5 py-1 bg-red-500/10 text-[10px] font-mono text-red-400 hover:bg-red-500/20 cursor-pointer"
                            >
                              Dzēst
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: MOOD FILTERS */}
                {activeTab === 'moods' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-ivory font-bold">Noskaņas & Filtru Pogas</h2>
                        <p className="text-xs text-ivory-dim mt-1 font-bold">Kārtojiet, pievienojiet vai konfigurējiet ātrās filtrēšanas kategorijas.</p>
                      </div>

                      <button
                        onClick={startNewMood}
                        className="rounded-full bg-gold px-5 py-2 font-mono text-xs uppercase tracking-wider text-espresso font-bold transition-all hover:bg-gold-soft cursor-pointer"
                      >
                        + Pievienot noskaņu
                      </button>
                    </div>

                    {editingMood && (
                      <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 space-y-4">
                        <h3 className="font-display text-lg font-bold text-gold">Rediģēt Noskaņu: {editingMood.label || 'Jauna'}</h3>
                        <form onSubmit={handleSaveMoodSubmit} className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">ID *</label>
                            <input
                              type="text"
                              required
                              value={editingMood.id}
                              onChange={(e) => setEditingMood({ ...editingMood, id: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-3 py-2 text-xs text-ivory"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Pogas teksts *</label>
                            <input
                              type="text"
                              required
                              value={editingMood.label}
                              onChange={(e) => setEditingMood({ ...editingMood, label: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-3 py-2 text-xs text-ivory"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Mērķa Kategorija</label>
                            <select
                              value={editingMood.category}
                              onChange={(e) => setEditingMood({ ...editingMood, category: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-3 py-2 text-xs text-ivory"
                            >
                              <option value="all">Visi (all)</option>
                              {flavoursList.map(f => (
                                <option key={f.id} value={f.id}>{f.name} ({f.id})</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Izcelšanas krāsa (Hex)</label>
                            <input
                              type="text"
                              value={editingMood.highlightColor}
                              onChange={(e) => setEditingMood({ ...editingMood, highlightColor: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-3 py-2 text-xs text-ivory"
                            />
                          </div>

                          <div className="sm:col-span-2 flex justify-end gap-2.5 pt-2">
                            <button
                              type="button"
                              onClick={() => setEditingMood(null)}
                              className="rounded-xl bg-white/5 px-4 py-2 font-mono text-xs text-ivory hover:bg-white/10 cursor-pointer"
                            >
                              Atcelt
                            </button>
                            <button
                              type="submit"
                              className="rounded-xl bg-gold px-5 py-2 font-mono text-xs text-espresso font-bold hover:bg-gold-soft cursor-pointer"
                            >
                              Saglabāt
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    <div className="rounded-2xl border border-white/5 bg-espresso-2/40 overflow-hidden divide-y divide-white/5">
                      {moodButtons.map((m, idx) => (
                        <div key={m.id} className="flex justify-between items-center p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full border border-white/10" style={{ backgroundColor: m.highlightColor }} />
                            <div>
                              <h4 className="font-mono text-sm text-ivory font-bold">{m.label}</h4>
                              <p className="text-[10px] text-ivory-dim/60">Kategorija: {m.category} · Kārtas numurs: {m.order}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingMood(m)}
                              className="rounded px-2 py-1 bg-white/5 text-[10px] font-mono text-gold hover:bg-white/10 cursor-pointer"
                            >
                              Labot
                            </button>
                            <button
                              onClick={() => { if (confirm('Dzēst šo noskaņu pogu?')) deleteMoodButton(m.id) }}
                              className="rounded px-2 py-1 bg-red-500/10 text-[10px] font-mono text-red-400 hover:bg-red-500/20 cursor-pointer"
                            >
                              Dzēst
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: GALLERY TAB (NEW) */}
                {activeTab === 'gallery_tab' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-ivory font-bold">Mājaslapas Attēlu Galerija</h2>
                        <p className="text-xs text-ivory-dim mt-1 font-semibold">Augšupielādējiet jaunas bildes no sava telefona vai datora ar pievilcīgiem aprakstiem.</p>
                      </div>

                      <button
                        onClick={startNewGalleryImage}
                        className="rounded-full bg-gold px-5 py-2 font-mono text-xs uppercase tracking-wider text-espresso font-bold transition-all hover:bg-gold-soft cursor-pointer"
                      >
                        + Pievienot Bildi
                      </button>
                    </div>

                    {editingGallery && (
                      <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 space-y-4">
                        <h3 className="font-display text-lg font-bold text-gold">Pievienot bildi galerijai</h3>
                        <form onSubmit={handleSaveGallerySubmit} className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">ID</label>
                            <input
                              type="text"
                              required
                              value={editingGallery.id}
                              onChange={(e) => setEditingGallery({ ...editingGallery, id: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-3 py-2 text-xs text-ivory"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Apraksts / Paraksts (Caption)</label>
                            <input
                              type="text"
                              required
                              value={editingGallery.caption}
                              onChange={(e) => setEditingGallery({ ...editingGallery, caption: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-3 py-2 text-xs text-ivory"
                              placeholder="Kraukšķīgi augļu makarūni 🍓"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Augšupielādēt failu 📷</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, (base64) => setEditingGallery({ ...editingGallery, image: base64 }))}
                              className="w-full font-mono text-xs text-ivory"
                            />
                            {editingGallery.image && (
                              <img src={editingGallery.image} className="mt-2 h-32 w-32 object-cover rounded border border-white/10" alt="Priekšskatījums" />
                            )}
                          </div>

                          <div className="sm:col-span-2 flex justify-end gap-2.5 pt-2">
                            <button
                              type="button"
                              onClick={() => setEditingGallery(null)}
                              className="rounded-xl bg-white/5 px-4 py-2 font-mono text-xs text-ivory hover:bg-white/10 cursor-pointer"
                            >
                              Atcelt
                            </button>
                            <button
                              type="submit"
                              className="rounded-xl bg-gold px-5 py-2 font-mono text-xs text-espresso font-bold hover:bg-gold-soft cursor-pointer"
                            >
                              Pievienot Galerijai
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-3">
                      {galleryList.map(item => (
                        <div key={item.id} className="relative rounded-2xl border border-white/10 bg-espresso-2/40 p-4 flex flex-col justify-between">
                          <img
                            src={item.image}
                            alt={item.caption}
                            className="w-full aspect-video object-cover rounded-xl border border-white/5 bg-espresso mb-3"
                            onError={(e) => { e.target.onerror = null; e.target.src = '/assets/logo.webp' }}
                          />
                          <p className="text-xs text-ivory-dim font-display italic font-semibold">{item.caption || 'Bez paraksta'}</p>
                          <div className="flex justify-end mt-3 pt-2 border-t border-white/5">
                            <button
                              onClick={() => { if (confirm('Dzēst šo bildi no galerijas?')) deleteGalleryImage(item.id) }}
                              className="rounded px-2.5 py-1 bg-red-500/10 text-[10px] font-mono text-red-400 hover:bg-red-500/20 cursor-pointer"
                            >
                              Dzēst
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: GAME ACHIEVEMENTS & REWARDS */}
                {activeTab === 'game' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-ivory font-bold">Makarūnu Mozaīkas Spēle & Balvu Loģika</h2>
                      <p className="text-xs text-ivory-dim mt-1">Konfigurējiet sliekšņus spēles sasniegumu reģistrācijai un sekojiet līdzi radītajiem atlaižu kodiem.</p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/5 bg-espresso-2/30 p-6 space-y-4">
                        <h3 className="font-display text-lg font-bold text-gold flex items-center gap-2">🎯 Sliekšņu konfigurācija</h3>

                        <div>
                          <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Quiz Viktorīna (Pareizo atbilžu slieksnis)</label>
                          <input
                            type="number"
                            value={quizMilestone}
                            onChange={(e) => setQuizMilestone(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-espresso px-4 py-2.5 text-sm text-ivory"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Bezgalīgā spēle (Punktu slieksnis)</label>
                          <input
                            type="number"
                            value={scoreMilestone}
                            onChange={(e) => setScoreMilestone(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-espresso px-4 py-2.5 text-sm text-ivory"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1 font-bold">Līmeņu spēle (Līmeņu slieksnis, piemēram, 15 līmeņi)</label>
                          <input
                            type="number"
                            value={levelMilestone}
                            onChange={(e) => setLevelMilestone(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-espresso px-4 py-2.5 text-sm text-ivory"
                          />
                        </div>

                        {/* Optional time limit constraints */}
                        <div className="flex items-center gap-2.5 py-1.5">
                          <input
                            id="timeLimitToggle"
                            type="checkbox"
                            checked={useTimeLimit}
                            onChange={(e) => setUseTimeLimit(e.target.checked)}
                            className="h-4 w-4 text-gold border-white/10 bg-espresso rounded focus:ring-1 focus:ring-gold"
                          />
                          <label htmlFor="timeLimitToggle" className="font-mono text-xs text-ivory">Ierobežot laiku gājienam / viktorīnai</label>
                        </div>

                        {useTimeLimit && (
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Laika ierobežojums sekundēs</label>
                            <input
                              type="number"
                              value={timeLimitSeconds}
                              onChange={(e) => setTimeLimitSeconds(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-4 py-2 text-xs text-ivory"
                            />
                          </div>
                        )}

                        <button
                          onClick={handleSaveGameMilestones}
                          className="rounded-full bg-gold px-5 py-2.5 font-mono text-xs uppercase text-espresso font-bold hover:bg-gold-soft cursor-pointer"
                        >
                          Saglabāt Sliekšņus
                        </button>
                      </div>

                      {/* Configurable rewards options list */}
                      <div className="rounded-2xl border border-white/5 bg-espresso-2/30 p-6 space-y-4">
                        <h3 className="font-display text-lg font-bold text-gold flex items-center gap-2">🎁 Konfigurētās Balvas & Opcijas</h3>

                        <div className="space-y-2.5 max-h-48 overflow-y-auto">
                          {(gameConfig.rewardOptions || []).map(opt => (
                            <div key={opt.id} className="p-3 bg-espresso rounded-xl border border-white/5 text-xs flex justify-between items-center">
                              <div>
                                <span className="font-mono text-[9px] text-gold uppercase tracking-wider font-bold">[{opt.type}] · {opt.value}</span>
                                <p className="font-bold text-ivory mt-0.5">{opt.desc}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteRewardOption(opt.id)}
                                className="text-[10px] font-mono text-red-400 hover:underline cursor-pointer"
                              >
                                Dzēst
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Reward Option Form */}
                        <form onSubmit={handleAddRewardOption} className="border-t border-white/5 pt-3 space-y-2.5">
                          <p className="font-mono text-[10px] uppercase text-gold font-bold">Pievienot jaunu balvas opciju mājaslapai</p>
                          <div className="grid gap-2 grid-cols-2">
                            <select
                              value={newRewardType}
                              onChange={(e) => setNewRewardType(e.target.value)}
                              className="rounded-lg border border-white/10 bg-espresso p-2 text-xs text-ivory"
                            >
                              <option value="discount">Atlaide % / summas apmērā</option>
                              <option value="gift_ribbon">Dāvanu lentīte bezmaksas</option>
                              <option value="gift_box">Bezmaksas dāvanu kaste</option>
                              <option value="qty_discount">Samazināts vienību skaits ar atlaidi</option>
                            </select>
                            <input
                              type="text"
                              required
                              value={newRewardValue}
                              onChange={(e) => setNewRewardValue(e.target.value)}
                              placeholder="Vērtība (piem. Bezmaksas lentīte)"
                              className="rounded-lg border border-white/10 bg-espresso p-2 text-xs text-ivory"
                            />
                          </div>
                          <input
                            type="text"
                            required
                            value={newRewardDesc}
                            onChange={(e) => setNewRewardDesc(e.target.value)}
                            placeholder="Īss balvas apraksts klientam"
                            className="w-full rounded-lg border border-white/10 bg-espresso p-2 text-xs text-ivory"
                          />
                          <button
                            type="submit"
                            className="rounded bg-gold/15 text-gold border border-gold/25 px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider font-bold cursor-pointer"
                          >
                            Pievienot Opciju
                          </button>
                        </form>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-espresso-2/20 p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-display text-lg font-bold text-gold font-bold">Sniegtie un Pieprasītie Balvu Kodi</h3>
                        <button
                          onClick={() => exportToCSV(rewardCodes, 'claimed_rewards_export')}
                          className="text-xs font-mono text-gold underline hover:text-gold-soft cursor-pointer"
                        >
                          Eksportēt CSV ⭳
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs divide-y divide-white/5">
                          <thead>
                            <tr className="font-mono text-[10px] text-gold/80 uppercase">
                              <th className="py-2">Kods</th>
                              <th className="py-2">Apmeklētājs</th>
                              <th className="py-2">Balva</th>
                              <th className="py-2">Datums</th>
                              <th className="py-2">Statuss</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {rewardCodes.map(c => (
                              <tr key={c.id}>
                                <td className="py-2 font-mono font-bold text-ivory">{c.code}</td>
                                <td className="py-2 text-ivory-dim">{c.user}</td>
                                <td className="py-2 text-ivory-dim">{c.reward}</td>
                                <td className="py-2 text-ivory-dim">{c.date}</td>
                                <td className="py-2">
                                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">AKTĪVS</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: CONTACT FORM SUBMISSIONS & BUSINESS ANALYTICS */}
                {activeTab === 'inquiries' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-ivory font-bold">Pasūtījumu & Kontaktformu Žurnāls</h2>
                        <p className="text-xs text-ivory-dim mt-1">Skatīt un apstrādāt visus ienākošos pieteikumus, kas nosūtīti no tīmekļa vietnes.</p>
                      </div>

                      <div className="flex gap-2.5">
                        <button
                          onClick={() => exportToCSV(inquiries, 'macaron_orders_export')}
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-gold hover:bg-white/10 cursor-pointer"
                        >
                          CSV Eksports ⭳
                        </button>
                        <button
                          onClick={() => exportToJSON(inquiries, 'macaron_orders_export')}
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-gold hover:bg-white/10 cursor-pointer"
                        >
                          JSON Eksports ⭳
                        </button>
                      </div>
                    </div>

                    {/* Analytics Overview Cards */}
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-xl border border-white/5 bg-espresso-2/40 p-4 text-center">
                        <span className="block text-[10px] font-mono uppercase text-gold/60">Apmeklējumi (Visits)</span>
                        <span className="font-display text-3xl font-bold text-ivory">{analytics.siteVisits}</span>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-espresso-2/40 p-4 text-center">
                        <span className="block text-[10px] font-mono uppercase text-gold/60">Balvas Izsniegtas</span>
                        <span className="font-display text-3xl font-bold text-ivory">{analytics.claimedRewards}</span>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-espresso-2/40 p-4 text-center">
                        <span className="block text-[10px] font-mono uppercase text-gold/60">Iesniegti pieteikumi</span>
                        <span className="font-display text-3xl font-bold text-ivory">{inquiries.length}</span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-espresso-2/30 p-6 space-y-4">
                      <h3 className="font-display text-lg font-bold text-gold">Top Noklikšķinātās Garšas</h3>
                      <div className="grid gap-3 sm:grid-cols-5">
                        {Object.entries(analytics.flavourClicks).map(([flav, count]) => (
                          <div key={flav} className="p-3 rounded-lg bg-espresso/50 border border-white/5 text-center">
                            <span className="block text-[10px] font-mono uppercase text-ivory-dim/60">{flav}</span>
                            <span className="font-bold text-gold text-sm">{count} klikšķi</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Inquiries table */}
                    <div className="rounded-2xl border border-white/5 bg-espresso-2/30 p-6 space-y-4">
                      <h3 className="font-display text-lg font-bold text-gold">Ienākošie Pieteikumi</h3>
                      <div className="space-y-4">
                        {inquiries.length === 0 ? (
                          <p className="text-center text-xs text-ivory-dim/50 py-8">Nav saņemts neviens pieteikums.</p>
                        ) : (
                          inquiries.map((inq) => (
                            <div key={inq.id} className="p-5 bg-espresso rounded-2xl border border-white/5 space-y-3 relative overflow-hidden">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-display font-semibold text-base text-ivory">{inq.name}</h4>
                                  <p className="text-xs text-ivory-dim">{inq.email} · {inq.phone}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <select
                                    value={inq.status}
                                    onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                                    className={`rounded-lg px-2.5 py-1 text-xs outline-none ${
                                      inq.status === 'Completed'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    }`}
                                  >
                                    <option value="Pending" className="bg-espresso text-ivory">Pending (Apstrādē)</option>
                                    <option value="Completed" className="bg-espresso text-ivory">Completed (Pabeigts)</option>
                                  </select>

                                  <button
                                    onClick={() => { if (confirm('Dzēst šo pieteikumu?')) deleteInquiry(inq.id) }}
                                    className="text-xs text-red-400 underline hover:text-red-300 font-mono cursor-pointer"
                                  >
                                    Dzēst
                                  </button>
                                </div>
                              </div>

                              <div className="grid gap-2 sm:grid-cols-2 text-xs border-t border-white/5 pt-3">
                                <div>
                                  <span className="block font-mono text-[9px] text-gold uppercase tracking-wider">Garšas & Daudzums</span>
                                  <p className="text-ivory mt-0.5">{inq.flavours} ({inq.qty} gab.)</p>
                                </div>
                                <div>
                                  <span className="block font-mono text-[9px] text-gold uppercase tracking-wider">Piezīmes / Adrese</span>
                                  <p className="text-ivory mt-0.5">{inq.notes || '-'}</p>
                                </div>
                              </div>
                              <span className="absolute bottom-2.5 right-4 font-mono text-[9px] text-ivory-dim/40">{inq.date}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: ADMINS */}
                {activeTab === 'admins' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-ivory font-bold">Administratīvo Kontu Pārvalde</h2>
                      <p className="text-xs text-ivory-dim mt-1">Uzaiciniet jaunus administrācijas darbiniekus, piešķiriet lomas vai pārtrauciet to sesijas.</p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                      {/* Invite Admin Form */}
                      <div className="rounded-2xl border border-white/5 bg-espresso-2/30 p-6 space-y-4 sm:col-span-1">
                        <h3 className="font-display text-lg font-bold text-gold font-bold">Uzaicināt administratoru</h3>
                        <form onSubmit={handleInviteAdminSubmit} className="space-y-3">
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Vārds Uzvārds</label>
                            <input
                              type="text"
                              required
                              value={newAdminName}
                              onChange={(e) => setNewAdminName(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-3 py-2 text-xs text-ivory outline-none"
                              placeholder="Laura Ozola"
                            />
                          </div>

                          <div>
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">E-pasts</label>
                            <input
                              type="email"
                              required
                              value={newAdminEmail}
                              onChange={(e) => setNewAdminEmail(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-3 py-2 text-xs text-ivory outline-none"
                              placeholder="laura@macaroongarden.lv"
                            />
                          </div>

                          <div>
                            <label className="block font-mono text-[10px] uppercase text-gold/80 mb-1">Privilēģijas līmenis</label>
                            <select
                              value={newAdminRole}
                              onChange={(e) => setNewAdminRole(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-espresso px-3 py-2 text-xs text-ivory outline-none"
                            >
                              <option value="Super-Admin">Super-Admin (Pilna piekļuve)</option>
                              <option value="Editor">Editor (Rediģēt saturu)</option>
                              <option value="Viewer">Viewer (Tikai skatīties)</option>
                            </select>
                          </div>

                          <button
                            type="submit"
                            className="w-full mt-2 rounded-xl bg-gold py-2.5 font-mono text-xs text-espresso font-bold hover:bg-gold-soft cursor-pointer"
                          >
                            Nosūtīt uzaicinājumu
                          </button>
                        </form>
                      </div>

                      {/* Active Admins list */}
                      <div className="rounded-2xl border border-white/5 bg-espresso-2/30 p-6 space-y-4 sm:col-span-2">
                        <h3 className="font-display text-lg font-bold text-gold font-bold">Aktīvie Administrācijas Konti</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs divide-y divide-white/5">
                            <thead>
                              <tr className="font-mono text-[10px] text-gold/80 uppercase">
                                <th className="py-2">Vārds</th>
                                <th className="py-2">E-pasts</th>
                                <th className="py-2">Loma</th>
                                <th className="py-2">Rīki</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              <tr>
                                <td className="py-3 text-ivory font-bold">Jānis Začs (Super-Admin)</td>
                                <td className="py-3 text-ivory-dim">janiszacs@gmail.com</td>
                                <td className="py-3"><span className="bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded text-[10px] font-mono">SUPER</span></td>
                                <td className="py-3 text-ivory-dim/40">-</td>
                              </tr>
                              {adminList.filter(a => a.email !== 'janiszacs@gmail.com').map(admin => (
                                <tr key={admin.email}>
                                  <td className="py-3 text-ivory font-bold">{admin.name}</td>
                                  <td className="py-3 text-ivory-dim">{admin.email}</td>
                                  <td className="py-3"><span className="bg-white/5 text-ivory-dim border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono">{admin.role}</span></td>
                                  <td className="py-3">
                                    <button
                                      onClick={() => { if (confirm('Noņemt šo administratoru?')) removeAdmin(admin.email) }}
                                      className="text-red-400 underline hover:text-red-300 font-mono text-[10px] cursor-pointer"
                                    >
                                      Noņemt
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
