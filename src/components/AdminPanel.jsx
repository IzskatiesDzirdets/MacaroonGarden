import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCMS } from '../hooks/useCMS'

export default function AdminPanel({ isOpen, onClose }) {
  const {
    adminUser,
    adminList,
    loginAdmin,
    logoutAdmin,
    resetPasswordRequest,
    inviteAdmin,
    removeAdmin,
    cmsContent,
    updateCMSContent,
    flavoursList,
    saveFlavour,
    deleteFlavour,
    moodButtons,
    saveMoodButton,
    deleteMoodButton,
    reorderMoodButtons,
    sectionsList,
    saveSectionList,
    galleryList,
    saveGalleryImage,
    deleteGalleryImage,
    blogList,
    saveBlogPost,
    deleteBlogPost,
    gameConfig,
    saveGameConfig,
    rewardCodes,
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    analytics,
  } = useCMS()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthErrorLoading] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSentMsg, setForgotSentMsg] = useState('')
  const [showForgot, setShowForgot] = useState(false)

  // Tab selections inside panel
  const [activeTab, setActiveTab] = useState('sections')

  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthErrorLoading(true)
    try {
      await loginAdmin(username.trim(), password)
    } catch (err) {
      setAuthError(err.message || 'Pieslēgšanās kļūda.')
    } finally {
      setAuthErrorLoading(false)
    }
  }

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setForgotSentMsg('')
    setAuthError('')
    try {
      const res = await resetPasswordRequest(forgotEmail.trim())
      setForgotSentMsg(res.message)
    } catch (err) {
      setAuthError(err.message)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-espresso/80 backdrop-blur-md">
      <div className="h-full w-full max-w-5xl bg-espresso-2 border-l border-white/10 shadow-2xl flex flex-col pointer-events-auto overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/5 bg-espresso px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛠️</span>
            <div>
              <h2 className="font-display text-lg font-bold text-gold">Vadības panelis & CMS</h2>
              <p className="text-[10px] font-mono text-ivory-dim/50 uppercase tracking-widest">
                Executive control board v3.0
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/5 p-2 text-ivory-dim hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Auth Guard Screen */}
        {!adminUser ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-espresso-3/30 overflow-y-auto">
            <div className="w-full max-w-md rounded-2xl border border-gold/15 bg-espresso p-8 shadow-2xl ring-1 ring-gold/10">
              <div className="text-center mb-6">
                <span className="text-4xl block mb-2">🧁</span>
                <h3 className="font-display text-xl font-bold text-gold">Autorizācija</h3>
                <p className="text-xs text-ivory-dim/60 mt-1">Sistēmas administratoru piekļuves logs</p>
              </div>

              {authError && (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                  {authError}
                </div>
              )}

              {forgotSentMsg && (
                <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                  {forgotSentMsg}
                </div>
              )}

              {!showForgot ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-gold/80 mb-1">
                      Lietotājvārds / E-pasts
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2.5 font-body text-sm text-ivory outline-none focus:border-gold/50"
                      placeholder="Ievadiet segvārdu..."
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-gold/80 mb-1">
                      Parole
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2.5 font-body text-sm text-ivory outline-none focus:border-gold/50"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full rounded-full bg-gold py-3.5 font-mono text-xs uppercase tracking-widest text-espresso font-bold transition-all hover:bg-gold-soft cursor-pointer flex items-center justify-center gap-2"
                  >
                    {authLoading ? 'Notiek pieslēgšanās...' : 'Ielogoties Panelī'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setShowForgot(true); setAuthError(''); }}
                      className="text-[10px] font-mono text-gold/70 hover:underline"
                    >
                      Aizmirsu paroli?
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-gold/80 mb-1">
                      Norādiet administratora e-pastu
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2.5 font-body text-sm text-ivory outline-none focus:border-gold/50"
                      placeholder="vards@macaroongarden.lv"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-gold py-3.5 font-mono text-xs uppercase tracking-widest text-espresso font-bold transition-all hover:bg-gold-soft cursor-pointer"
                  >
                    Nosūtīt atkopšanas e-pastu
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setShowForgot(false); setAuthError(''); setForgotSentMsg(''); }}
                      className="text-[10px] font-mono text-ivory-dim/60 hover:underline"
                    >
                      Atgriezties pie autorizācijas
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Frame */
          <div className="flex-1 flex flex-col min-h-0 bg-espresso-3/15">
            {/* Admin Info Bar */}
            <div className="bg-espresso-3 border-b border-white/5 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-ivory-dim">
                <span>Pieslēdzies:</span>
                <span className="font-bold text-ivory">{adminUser.name}</span>
                <span className="bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase">
                  {adminUser.role}
                </span>
              </div>
              <button
                onClick={logoutAdmin}
                className="text-[10px] font-mono text-blush hover:underline cursor-pointer"
              >
                Atslēgties no paneļa
              </button>
            </div>

            {/* Main Admin Tab Panel Split */}
            <div className="flex-1 flex min-h-0">
              {/* Tab Navigation Menu (Left) */}
              <div className="w-52 border-r border-white/5 bg-espresso/50 flex flex-col gap-1 p-3 overflow-y-auto shrink-0 select-none">
                {[
                  { id: 'sections', label: '🗂️ Sadaļas & Kārtošana' },
                  { id: 'content', label: '📝 Tekstu Redaktors' },
                  { id: 'flavours', label: '🌰 Garšu Sortiments' },
                  { id: 'gallery', label: '📸 Premium Galerija' },
                  { id: 'blog', label: '✍️ Zīmola Blogs' },
                  { id: 'game', label: '🎮 Puzles Balvas' },
                  { id: 'inquiries', label: '🛍️ Pasūtījumu Lapas' },
                  { id: 'admins', label: '👥 Administratori' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`w-full text-left rounded-xl p-3 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      activeTab === t.id
                        ? 'bg-gold/15 text-gold border-l-4 border-gold shadow-sm font-bold'
                        : 'text-ivory-dim/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Content Display (Right) */}
              <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-espresso-2/30">
                {/* Dynamically Inject form sections */}
                <div className="max-w-4xl space-y-8">
                  {activeTab === 'sections' && <SectionsTab sectionsList={sectionsList} saveSectionList={saveSectionList} />}
                  {activeTab === 'content' && <ContentTab cmsContent={cmsContent} updateCMSContent={updateCMSContent} />}
                  {activeTab === 'flavours' && (
                    <FlavoursTab
                      flavoursList={flavoursList}
                      saveFlavour={saveFlavour}
                      deleteFlavour={deleteFlavour}
                      moodButtons={moodButtons}
                      saveMoodButton={saveMoodButton}
                      deleteMoodButton={deleteMoodButton}
                      reorderMoodButtons={reorderMoodButtons}
                    />
                  )}
                  {activeTab === 'gallery' && (
                    <GalleryTab
                      galleryList={galleryList}
                      saveGalleryImage={saveGalleryImage}
                      deleteGalleryImage={deleteGalleryImage}
                    />
                  )}
                  {activeTab === 'blog' && (
                    <BlogTab
                      blogList={blogList}
                      saveBlogPost={saveBlogPost}
                      deleteBlogPost={deleteBlogPost}
                    />
                  )}
                  {activeTab === 'game' && <GameTab gameConfig={gameConfig} saveGameConfig={saveGameConfig} rewardCodes={rewardCodes} />}
                  {activeTab === 'inquiries' && (
                    <InquiriesTab
                      inquiries={inquiries}
                      updateInquiryStatus={updateInquiryStatus}
                      deleteInquiry={deleteInquiry}
                    />
                  )}
                  {activeTab === 'admins' && (
                    <AdminsTab
                      adminList={adminList}
                      inviteAdmin={inviteAdmin}
                      removeAdmin={removeAdmin}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionsTab({ sectionsList, saveSectionList }) {
  const toggleVisibility = (id) => {
    const updated = sectionsList.map(s => s.id === id ? { ...s, visible: !s.visible } : s)
    saveSectionList(updated)
  }

  const moveUp = (idx) => {
    if (idx === 0) return
    const updated = [...sectionsList]
    const temp = updated[idx]
    updated[idx] = updated[idx - 1]
    updated[idx - 1] = temp
    saveSectionList(updated)
  }

  const moveDown = (idx) => {
    if (idx === sectionsList.length - 1) return
    const updated = [...sectionsList]
    const temp = updated[idx]
    updated[idx] = updated[idx + 1]
    updated[idx + 1] = temp
    saveSectionList(updated)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-lg font-bold text-gold">Sadaļu pārvaldība & Kārtošana</h3>
        <p className="text-xs text-ivory-dim/60 mt-1">
          Aktivizē, deaktivizē vai maini mājas lapas sekciju izkārtojumu reāllaikā.
        </p>
      </div>

      <div className="space-y-2">
        {sectionsList.map((sec, idx) => (
          <div
            key={sec.id}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-espresso p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-gold/50 font-bold">#{idx + 1}</span>
              <span className="font-display text-sm font-semibold text-ivory">{sec.name}</span>
              <span className="text-[10px] font-mono text-ivory-dim/40 uppercase">({sec.id})</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Visible toggle */}
              <button
                onClick={() => toggleVisibility(sec.id)}
                className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase font-bold border cursor-pointer transition-all ${
                  sec.visible
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}
              >
                {sec.visible ? 'Aktīva' : 'Deaktivēta'}
              </button>

              <div className="flex gap-1">
                <button
                  disabled={idx === 0}
                  onClick={() => moveUp(idx)}
                  className="rounded bg-white/5 px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                >
                  ▲
                </button>
                <button
                  disabled={idx === sectionsList.length - 1}
                  onClick={() => moveDown(idx)}
                  className="rounded bg-white/5 px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContentTab({ cmsContent, updateCMSContent }) {
  const [selectedSection, setSelectedSection] = useState('hero')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-bold text-gold">Sadaļu Tekstu Redaktors</h3>
        <p className="text-xs text-ivory-dim/60 mt-1">
          Rediģē zīmola tekstus, aprakstus un aicinājumus uz rīcību (CTA).
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pb-4 border-b border-white/5">
        {Object.keys(cmsContent).map(sectionKey => (
          <button
            key={sectionKey}
            onClick={() => setSelectedSection(sectionKey)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              selectedSection === sectionKey
                ? 'bg-gold text-espresso font-bold'
                : 'bg-white/5 text-ivory-dim hover:bg-white/10'
            }`}
          >
            {sectionKey}
          </button>
        ))}
      </div>

      <div className="space-y-4 rounded-2xl border border-white/5 bg-espresso/45 p-6">
        <h4 className="font-mono text-xs uppercase tracking-wider text-gold font-bold mb-4">
          Rediģēt sadaļu: {selectedSection.toUpperCase()}
        </h4>

        {Object.entries(cmsContent[selectedSection]).map(([fieldKey, value]) => (
          <div key={fieldKey} className="space-y-1">
            <label className="block font-mono text-[10px] uppercase tracking-wider text-gold/80">
              {fieldKey}
            </label>
            {value.length > 80 ? (
              <textarea
                value={value}
                onChange={(e) => updateCMSContent(selectedSection, fieldKey, e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-sm text-ivory outline-none focus:border-gold/50"
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => updateCMSContent(selectedSection, fieldKey, e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-sm text-ivory outline-none focus:border-gold/50"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function FlavoursTab({
  flavoursList,
  saveFlavour,
  deleteFlavour,
  moodButtons,
  saveMoodButton,
  deleteMoodButton,
  reorderMoodButtons
}) {
  const [editingFlavour, setEditingFlavour] = useState(null)
  const [editingMood, setEditingMood] = useState(null)

  const handleFileChange = (e, callback) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      callback(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const startNewFlavour = () => {
    setEditingFlavour({
      id: Math.random().toString(36).substring(2, 9),
      tone: 'gold',
      name: '',
      note: '',
      ingredients: '',
      price: 2.20,
      badge: '',
      image: '/images/flavours/pistachio.png',
      hidden: false
    })
  }

  const startNewMood = () => {
    setEditingMood({
      id: Math.random().toString(36).substring(2, 9),
      label: '',
      category: '',
      highlightColor: '#D9A441',
      order: moodButtons.length + 1
    })
  }

  return (
    <div className="space-y-8">
      {/* 1. Flavours Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-gold">Garšu sortiments</h3>
            <p className="text-xs text-ivory-dim/60 mt-1">Pievieno, labo vai paslēp konditorejas garšas.</p>
          </div>
          <button
            onClick={startNewFlavour}
            className="rounded-full bg-gold/15 text-gold border border-gold/20 px-4 py-1.5 font-mono text-xs uppercase tracking-wider font-bold hover:bg-gold/25 cursor-pointer"
          >
            + Pievienot jaunu garšu
          </button>
        </div>

        {editingFlavour && (
          <div className="rounded-2xl border border-gold/20 bg-espresso p-6 space-y-4">
            <h4 className="font-display font-bold text-gold text-sm">
              {flavoursList.find(f => f.id === editingFlavour.id) ? 'Labot garšu' : 'Jauna garša'}
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase text-gold/80">Nosaukums *</label>
                <input
                  type="text"
                  value={editingFlavour.name}
                  onChange={(e) => setEditingFlavour({ ...editingFlavour, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase text-gold/80">Cena (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingFlavour.price}
                  onChange={(e) => setEditingFlavour({ ...editingFlavour, price: parseFloat(e.target.value) })}
                  className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-[10px] uppercase text-gold/80">Īss apraksts *</label>
              <input
                type="text"
                value={editingFlavour.note}
                onChange={(e) => setEditingFlavour({ ...editingFlavour, note: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-[10px] uppercase text-gold/80">Sastāvdaļas</label>
              <textarea
                value={editingFlavour.ingredients}
                onChange={(e) => setEditingFlavour({ ...editingFlavour, ingredients: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase text-gold/80">Uzlīme / Žetons (Badge)</label>
                <input
                  type="text"
                  value={editingFlavour.badge}
                  placeholder="Piem. Populārs, Jaunums"
                  onChange={(e) => setEditingFlavour({ ...editingFlavour, badge: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase text-gold/80">Attēls (Saderīgs ar augšupielādi)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, (b64) => setEditingFlavour({ ...editingFlavour, image: b64 }))}
                  className="w-full text-xs text-ivory-dim"
                />
                <p className="text-[9px] text-ivory-dim/40 mt-1">Vai ievadiet tiešo URL zemāk</p>
                <input
                  type="text"
                  value={editingFlavour.image}
                  onChange={(e) => setEditingFlavour({ ...editingFlavour, image: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-mono text-ivory">
                <input
                  type="checkbox"
                  checked={editingFlavour.hidden}
                  onChange={(e) => setEditingFlavour({ ...editingFlavour, hidden: e.target.checked })}
                />
                Slēpt šo garšu no klienta kartes
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { saveFlavour(editingFlavour); setEditingFlavour(null); }}
                className="rounded-full bg-gold px-4 py-1.5 font-mono text-xs uppercase text-espresso font-bold cursor-pointer"
              >
                Saglabāt
              </button>
              <button
                onClick={() => setEditingFlavour(null)}
                className="rounded-full bg-white/5 px-4 py-1.5 font-mono text-xs uppercase text-ivory-dim cursor-pointer"
              >
                Atcelt
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {flavoursList.map(fl => (
            <div key={fl.id} className="flex gap-4 items-center justify-between rounded-xl border border-white/5 bg-espresso p-4">
              <div className="flex items-center gap-3">
                <img
                  src={fl.image}
                  alt={fl.name}
                  className="h-12 w-12 rounded-full object-cover border border-white/10 shadow-sm"
                  onError={(e) => { e.target.src = '/logo.webp' }}
                />
                <div>
                  <span className="block text-xs font-bold text-ivory">{fl.name}</span>
                  <span className="block text-[10px] text-gold/80 font-mono">{fl.price} € · {fl.badge || 'Nav žetona'}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setEditingFlavour(fl)}
                  className="text-[10px] font-mono text-gold hover:underline"
                >
                  Labot
                </button>
                <button
                  onClick={() => deleteFlavour(fl.id)}
                  className="text-[10px] font-mono text-blush hover:underline"
                >
                  Dzēst
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Mood Filters Management */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-gold">Garastāvokļa Filtri</h3>
            <p className="text-xs text-ivory-dim/60 mt-1">Kārto un filtrē makarūnus pēc pircēja noskaņas.</p>
          </div>
          <button
            onClick={startNewMood}
            className="rounded-full bg-gold/15 text-gold border border-gold/20 px-4 py-1.5 font-mono text-xs uppercase tracking-wider font-bold hover:bg-gold/25 cursor-pointer"
          >
            + Pievienot filtru
          </button>
        </div>

        {editingMood && (
          <div className="rounded-2xl border border-gold/20 bg-espresso p-6 space-y-4">
            <h4 className="font-display font-bold text-gold text-sm">Jauns noskaņas filtrs</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase text-gold/80">Nosaukums (un emocijzīme) *</label>
                <input
                  type="text"
                  value={editingMood.label}
                  placeholder="Piem. Kaisle ❤️"
                  onChange={(e) => setEditingMood({ ...editingMood, label: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase text-gold/80">Kategorijas filtrs (ID) *</label>
                <input
                  type="text"
                  value={editingMood.category}
                  placeholder="Piem. rose-aveni, all"
                  onChange={(e) => setEditingMood({ ...editingMood, category: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-[10px] uppercase text-gold/80">Izcēluma Krāsa (Hex) *</label>
              <input
                type="color"
                value={editingMood.highlightColor}
                onChange={(e) => setEditingMood({ ...editingMood, highlightColor: e.target.value })}
                className="h-8 w-16 rounded border border-white/10 cursor-pointer"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { saveMoodButton(editingMood); setEditingMood(null); }}
                className="rounded-full bg-gold px-4 py-1.5 font-mono text-xs uppercase text-espresso font-bold cursor-pointer"
              >
                Saglabāt
              </button>
              <button
                onClick={() => setEditingMood(null)}
                className="rounded-full bg-white/5 px-4 py-1.5 font-mono text-xs uppercase text-ivory-dim cursor-pointer"
              >
                Atcelt
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {moodButtons.map((mood, idx) => (
            <div key={mood.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-espresso p-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: mood.highlightColor }} />
                <span className="font-display text-sm font-semibold text-ivory">{mood.label}</span>
                <span className="text-[10px] font-mono text-ivory-dim/40">({mood.category})</span>
              </div>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => setEditingMood(mood)}
                  className="text-[10px] font-mono text-gold hover:underline"
                >
                  Labot
                </button>
                <button
                  onClick={() => deleteMoodButton(mood.id)}
                  className="text-[10px] font-mono text-blush hover:underline"
                >
                  Dzēst
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GalleryTab({ galleryList, saveGalleryImage, deleteGalleryImage }) {
  const [editingImage, setEditingImage] = useState(null)

  const handleFileChange = (e, callback) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      callback(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const startNewImage = () => {
    setEditingImage({
      id: Math.random().toString(36).substring(2, 9),
      caption: '',
      image: '',
      type: 'image',
      active: true,
      order: galleryList.length + 1
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-gold">Premium Galerija</h3>
          <p className="text-xs text-ivory-dim/60 mt-1">Augšupielādē vai pārvaldi zīmola foto un video failus.</p>
        </div>
        <button
          onClick={startNewImage}
          className="rounded-full bg-gold/15 text-gold border border-gold/20 px-4 py-1.5 font-mono text-xs uppercase tracking-wider font-bold hover:bg-gold/25 cursor-pointer"
        >
          + Pievienot failu
        </button>
      </div>

      {editingImage && (
        <div className="rounded-2xl border border-gold/20 bg-espresso p-6 space-y-4">
          <h4 className="font-display font-bold text-gold text-sm">Jauns galerijas objekts</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block font-mono text-[10px] uppercase text-gold/80">Apraksts / Paraksts *</label>
              <input
                type="text"
                required
                value={editingImage.caption}
                onChange={(e) => setEditingImage({ ...editingImage, caption: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-mono text-[10px] uppercase text-gold/80">Mēdija tips *</label>
              <select
                value={editingImage.type}
                onChange={(e) => setEditingImage({ ...editingImage, type: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
              >
                <option value="image">Attēls (Image)</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-mono text-[10px] uppercase text-gold/80">Izvēlies failu (No telefona vai datora)</label>
            <input
              type="file"
              accept={editingImage.type === 'video' ? 'video/*' : 'image/*'}
              onChange={(e) => handleFileChange(e, (b64) => setEditingImage({ ...editingImage, image: b64 }))}
              className="w-full text-xs text-ivory-dim"
            />
            <p className="text-[9px] text-ivory-dim/40 mt-1">Vai ievadiet tiešo saiti (URL) zemāk</p>
            <input
              type="text"
              value={editingImage.image}
              onChange={(e) => setEditingImage({ ...editingImage, image: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none mt-1"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => { saveGalleryImage(editingImage); setEditingImage(null); }}
              className="rounded-full bg-gold px-4 py-1.5 font-mono text-xs uppercase text-espresso font-bold cursor-pointer"
            >
              Saglabāt
            </button>
            <button
              onClick={() => setEditingImage(null)}
              className="rounded-full bg-white/5 px-4 py-1.5 font-mono text-xs uppercase text-ivory-dim cursor-pointer"
            >
              Atcelt
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {galleryList.map(item => (
          <div key={item.id} className="rounded-xl border border-white/5 bg-espresso p-3 space-y-2 relative overflow-hidden group">
            {item.type === 'video' ? (
              <video
                src={item.image}
                className="w-full h-32 object-cover rounded-lg bg-black"
                controls
              />
            ) : (
              <img
                src={item.image}
                alt={item.caption}
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => { e.target.src = '/logo.webp' }}
              />
            )}
            <p className="text-[11px] text-ivory leading-tight truncate">{item.caption}</p>

            <div className="flex items-center justify-between text-[10px] font-mono border-t border-white/5 pt-2">
              <span className="bg-white/5 px-2 py-0.5 rounded text-[8px] uppercase tracking-wider text-gold font-bold">
                {item.type}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingImage(item)}
                  className="text-gold hover:underline"
                >
                  Labot
                </button>
                <button
                  onClick={() => deleteGalleryImage(item.id)}
                  className="text-blush hover:underline"
                >
                  Dzēst
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BlogTab({ blogList, saveBlogPost, deleteBlogPost }) {
  const [editingPost, setEditingPost] = useState(null)

  const handleFileChange = (e, callback) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      callback(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const startNewPost = () => {
    setEditingPost({
      id: Math.random().toString(36).substring(2, 9),
      title: '',
      excerpt: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      image: '',
      type: 'image',
      active: true,
      order: blogList.length + 1
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-gold">Zīmola Blogs & Padomi</h3>
          <p className="text-xs text-ivory-dim/60 mt-1">Pievieno jaunus padomus vai zīmola stāsta rakstus ar mēdiju failiem.</p>
        </div>
        <button
          onClick={startNewPost}
          className="rounded-full bg-gold/15 text-gold border border-gold/20 px-4 py-1.5 font-mono text-xs uppercase tracking-wider font-bold hover:bg-gold/25 cursor-pointer"
        >
          + Pievienot rakstu
        </button>
      </div>

      {editingPost && (
        <div className="rounded-2xl border border-gold/20 bg-espresso p-6 space-y-4">
          <h4 className="font-display font-bold text-gold text-sm">Jauns blogs / Padoms</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block font-mono text-[10px] uppercase text-gold/80">Virsraksts *</label>
              <input
                type="text"
                required
                value={editingPost.title}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-mono text-[10px] uppercase text-gold/80">Mēdija tips *</label>
              <select
                value={editingPost.type}
                onChange={(e) => setEditingPost({ ...editingPost, type: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
              >
                <option value="image">Attēls (Image)</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-mono text-[10px] uppercase text-gold/80">Īss ievads / Kopsavilkums *</label>
            <input
              type="text"
              required
              value={editingPost.excerpt}
              onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-mono text-[10px] uppercase text-gold/80">Pilns saturs *</label>
            <textarea
              required
              value={editingPost.content}
              onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-mono text-[10px] uppercase text-gold/80">Izvēlies mēdija failu (Attēls vai Video)</label>
            <input
              type="file"
              accept={editingPost.type === 'video' ? 'video/*' : 'image/*'}
              onChange={(e) => handleFileChange(e, (b64) => setEditingPost({ ...editingPost, image: b64 }))}
              className="w-full text-xs text-ivory-dim"
            />
            <p className="text-[9px] text-ivory-dim/40 mt-1">Vai tiešā saite (URL) zemāk</p>
            <input
              type="text"
              value={editingPost.image}
              onChange={(e) => setEditingPost({ ...editingPost, image: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none mt-1"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => { saveBlogPost(editingPost); setEditingPost(null); }}
              className="rounded-full bg-gold px-4 py-1.5 font-mono text-xs uppercase text-espresso font-bold cursor-pointer"
            >
              Saglabāt
            </button>
            <button
              onClick={() => setEditingPost(null)}
              className="rounded-full bg-white/5 px-4 py-1.5 font-mono text-xs uppercase text-ivory-dim cursor-pointer"
            >
              Atcelt
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {blogList.map(post => (
          <div key={post.id} className="rounded-xl border border-white/5 bg-espresso p-4 flex gap-4 items-start justify-between">
            <div className="flex gap-4">
              {post.image && (
                post.type === 'video' ? (
                  <video src={post.image} className="h-16 w-16 rounded-lg bg-black shrink-0 object-cover" />
                ) : (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-16 w-16 rounded-lg shrink-0 object-cover border border-white/10"
                    onError={(e) => { e.target.src = '/logo.webp' }}
                  />
                )
              )}
              <div>
                <span className="block text-xs font-bold text-ivory font-display">{post.title}</span>
                <span className="block text-[10px] text-ivory-dim/60 leading-relaxed mt-1 max-w-lg">{post.excerpt}</span>
                <span className="block text-[8px] font-mono text-gold mt-1 uppercase">{post.date} · {post.type}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setEditingPost(post)}
                className="text-[10px] font-mono text-gold hover:underline"
              >
                Labot
              </button>
              <button
                onClick={() => deleteBlogPost(post.id)}
                className="text-[10px] font-mono text-blush hover:underline"
              >
                Dzēst
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GameTab({ gameConfig, saveGameConfig, rewardCodes }) {
  const [quizMilestone, setQuizMilestone] = useState(gameConfig.quizMilestone)
  const [scoreMilestone, setScoreMilestone] = useState(gameConfig.scoreMilestone)
  const [levelMilestone, setLevelMilestone] = useState(gameConfig.levelMilestone)
  const [coloredMacaroonTarget, setColoredMacaroonTarget] = useState(gameConfig.coloredMacaroonTarget || 100)
  const [coloredMacaroonType, setColoredMacaroonType] = useState(gameConfig.coloredMacaroonType || 'rose-aveni')
  const [winnersCount, setWinnersCount] = useState(gameConfig.winnersCount || 3)
  const [promoFrequency, setPromoFrequency] = useState(gameConfig.promoFrequency || 3)
  const [promoOfferText, setPromoOfferText] = useState(gameConfig.promoOfferText || '')
  const [promoRedirectSection, setPromoRedirectSection] = useState(gameConfig.promoRedirectSection || '#builder')

  const handleSave = () => {
    saveGameConfig({
      ...gameConfig,
      quizMilestone: parseInt(quizMilestone),
      scoreMilestone: parseInt(scoreMilestone),
      levelMilestone: parseInt(levelMilestone),
      coloredMacaroonTarget: parseInt(coloredMacaroonTarget),
      coloredMacaroonType,
      winnersCount: parseInt(winnersCount),
      promoFrequency: parseInt(promoFrequency),
      promoOfferText,
      promoRedirectSection
    })
    alert('Spēles uzstādījumi veiksmīgi saglabāti!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-bold text-gold">Spēles uzstādījumi & Balvas</h3>
        <p className="text-xs text-ivory-dim/60 mt-1">Konfigurē puzles spēles atskaites punktus, balvu atslēgas, krāsu mērķus un reklāmas biežumu.</p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-espresso/45 p-6 space-y-4">
        <h4 className="font-mono text-xs uppercase tracking-wider text-gold font-bold">1. Balvu Sliekšņi & Mērķi</h4>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <label className="block font-mono text-[10px] uppercase text-gold/80">Viktorīnas slieksnis (Correct answers)</label>
            <input
              type="number"
              value={quizMilestone}
              onChange={(e) => setQuizMilestone(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-mono text-[10px] uppercase text-gold/80">Endless spēles rekords (Points)</label>
            <input
              type="number"
              value={scoreMilestone}
              onChange={(e) => setScoreMilestone(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-mono text-[10px] uppercase text-gold/80">Spēles līmenis (Level accomplished)</label>
            <input
              type="number"
              value={levelMilestone}
              onChange={(e) => setLevelMilestone(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 border-t border-white/5 pt-4">
          <div className="space-y-1">
            <label className="block font-mono text-[10px] uppercase text-gold/80">Krāsaino Makarūnu Mērķis (Skaits)</label>
            <input
              type="number"
              value={coloredMacaroonTarget}
              onChange={(e) => setColoredMacaroonTarget(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-mono text-[10px] uppercase text-gold/80">Mērķa Makarūna Tips</label>
            <select
              value={coloredMacaroonType}
              onChange={(e) => setColoredMacaroonType(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-white outline-none"
            >
              <option value="rose-aveni">Rozā (Roze un avenes)</option>
              <option value="chocolate">Šokolāde</option>
              <option value="lemon">Dzeltenā (Citronu kurds)</option>
              <option value="lavender">Lavandas</option>
              <option value="pistachio">Zaļā (Pistācija un vaniļa)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block font-mono text-[10px] uppercase text-gold/80">Uzvarētāju Skaits (Top x)</label>
            <input
              type="number"
              value={winnersCount}
              onChange={(e) => setWinnersCount(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
            />
          </div>
        </div>

        <h4 className="font-mono text-xs uppercase tracking-wider text-gold font-bold border-t border-white/5 pt-4">2. Spēles Reklāmas & Īpašie piedāvājumi</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block font-mono text-[10px] uppercase text-gold/80">Reklāmas Biežums (Ik pēc x līmeņiem/runs)</label>
            <input
              type="number"
              value={promoFrequency}
              onChange={(e) => setPromoFrequency(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-mono text-[10px] uppercase text-gold/80">Novirzīšanas Sadaļa (Redirect anchor)</label>
            <select
              value={promoRedirectSection}
              onChange={(e) => setPromoRedirectSection(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-white outline-none"
            >
              <option value="#builder">Kastīšu Konstruktors</option>
              <option value="#booking">Rezervācijas Kalendārs</option>
              <option value="#flavours">Garšu Ateljē</option>
              <option value="#gallery">Zīmola Galerija</option>
              <option value="#story">Mūsu Stāsts</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block font-mono text-[10px] uppercase text-gold/80">Īpašā piedāvājuma teksts spēlētājiem *</label>
          <textarea
            value={promoOfferText}
            onChange={(e) => setPromoOfferText(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none resize-y"
            placeholder="Piem. Īpašs piedāvājums spēlētājiem! Izmanto kodu..."
          />
        </div>

        <button
          onClick={handleSave}
          className="rounded-full bg-gold px-6 py-2 font-mono text-xs uppercase text-espresso font-bold cursor-pointer"
        >
          Saglabāt uzstādījumus
        </button>
      </div>

      {/* Rewards List Table */}
      <div className="space-y-3">
        <h4 className="font-mono text-xs uppercase tracking-wider text-gold font-bold">Piešķirtie spēļu reklāmas kodi</h4>
        <div className="rounded-xl border border-white/5 bg-espresso/20 p-4 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/5 text-gold/85">
                <th className="pb-2">Kods</th>
                <th className="pb-2">Lietotājs</th>
                <th className="pb-2">Atlaide</th>
                <th className="pb-2">Datums</th>
              </tr>
            </thead>
            <tbody>
              {rewardCodes.map(row => (
                <tr key={row.id} className="border-b border-white/5 last:border-0 text-ivory-dim/80">
                  <td className="py-2 text-white font-bold">{row.code}</td>
                  <td className="py-2">{row.user}</td>
                  <td className="py-2">{row.reward || row.value}</td>
                  <td className="py-2">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function InquiriesTab({ inquiries, updateInquiryStatus, deleteInquiry }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-bold text-gold">Pasūtījumu Lapas & Pieprasījumi</h3>
        <p className="text-xs text-ivory-dim/60 mt-1">Skaties, apstrādā vai apstiprini mājaslapas pieteikumus.</p>
      </div>

      <div className="space-y-4">
        {inquiries.map(inq => (
          <div key={inq.id} className="rounded-xl border border-white/5 bg-espresso p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
              <div>
                <span className="block text-sm font-bold text-ivory font-display">{inq.name}</span>
                <span className="block text-[10px] text-ivory-dim/50 font-mono mt-0.5">{inq.email} · {inq.phone}</span>
              </div>
              <div className="flex gap-2">
                <select
                  value={inq.status}
                  onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                  className="rounded bg-espresso-2 border border-white/10 px-2 py-1 text-xs text-white outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => deleteInquiry(inq.id)}
                  className="rounded bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 text-xs"
                >
                  Dzēst
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs leading-relaxed text-ivory-dim font-mono">
              <div>Daudzums: <span className="text-white font-bold">{inq.qty} gab.</span></div>
              <div>Garšas: <span className="text-white font-bold">{inq.flavours}</span></div>
            </div>

            {inq.notes && (
              <div className="text-[11px] leading-relaxed text-ivory-dim/80 bg-espresso-2/50 p-2.5 rounded-lg border border-white/5 font-mono">
                {inq.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminsTab({ adminList, inviteAdmin, removeAdmin }) {
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState('Administrator')

  const handleAdd = (e) => {
    e.preventDefault()
    try {
      inviteAdmin(newName.trim(), newEmail.trim(), newRole)
      setNewName('')
      setNewEmail('')
      alert('Administrators uzaicināts!')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-bold text-gold">Sistēmas administratori</h3>
        <p className="text-xs text-ivory-dim/60 mt-1">Uzaicini vai noņem administratorus ar tiesībām labot lapas tekstus.</p>
      </div>

      <form onSubmit={handleAdd} className="rounded-2xl border border-white/5 bg-espresso/45 p-6 grid gap-4 sm:grid-cols-3 items-end">
        <div className="space-y-1">
          <label className="block font-mono text-[10px] uppercase text-gold/80">Vārds Uzvārds *</label>
          <input
            type="text"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="block font-mono text-[10px] uppercase text-gold/80">E-pasts *</label>
          <input
            type="email"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-espresso-2 px-4 py-2 text-xs text-ivory outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-gold px-6 py-2.5 font-mono text-xs uppercase text-espresso font-bold cursor-pointer"
        >
          Uzaicināt administratoru
        </button>
      </form>

      <div className="space-y-2">
        {adminList.map(admin => (
          <div key={admin.email} className="flex items-center justify-between rounded-xl border border-white/5 bg-espresso p-4">
            <div>
              <span className="block text-xs font-bold text-ivory">{admin.name}</span>
              <span className="block text-[10px] text-ivory-dim/60 font-mono mt-0.5">{admin.email} · {admin.role}</span>
            </div>
            <button
              onClick={() => removeAdmin(admin.email)}
              className="text-[10px] font-mono text-blush hover:underline"
            >
              Noņemt
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
