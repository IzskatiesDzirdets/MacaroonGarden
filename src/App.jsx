import { useState, useEffect } from 'react'
import { motion, useScroll } from 'framer-motion'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import Nav from './components/Nav'
import HeroExplode from './components/HeroExplode'
import MobileFeatureList from './components/MobileFeatureList'
import AboutStory from './components/AboutStory'
import Flavours from './components/Flavours'
import BoxBuilder from './components/BoxBuilder'
import BookingForm from './components/BookingForm'
import GameSection from './components/GameSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import AccountModal from './components/AccountModal'
import GallerySection from './components/GallerySection'
import BlogSection from './components/BlogSection'
import AdminPanel from './components/AdminPanel'
import { useCMS } from './hooks/useCMS'

export default function App() {
  const { sectionsList } = useCMS()
  useSmoothScroll()
  const { scrollYProgress } = useScroll()

  // Multi-box cart system state shared between BoxBuilder and BookingForm
  const [selectedBoxes, setSelectedBoxes] = useState([])

  // Active flavor state lifted to synchronize background colors across Hero and Game iframe
  const [activeFlavor, setActiveFlavor] = useState(0)

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState('login')
  const [accountModalOpen, setAccountModalOpen] = useState(false)
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)

  // Route interception for /admin and #admin
  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setAdminPanelOpen(true)
    }
  }, [])

  const handleAuthOpen = (tab = 'login') => {
    setAuthModalTab(tab)
    setAuthModalOpen(true)
  }

  // Auto-apply tilt effect on cards
  useEffect(() => {
    const cards = document.querySelectorAll('.tilt-card, .feat-card, .flav-card')

    const handleMouseMove = (e) => {
      const el = e.currentTarget
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `perspective(700px) rotateX(${py * -8}deg) rotateY(${px * 8}deg) translateY(-6px)`
      el.style.transition = 'transform 0.1s ease'
    }

    const handleMouseLeave = (e) => {
      const el = e.currentTarget
      el.style.transform = ''
      el.style.transition = 'transform 0.4s ease'
    }

    cards.forEach((el) => {
      el.addEventListener('mousemove', handleMouseMove)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      cards.forEach((el) => {
        el.removeEventListener('mousemove', handleMouseMove)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  // Render landing sections according to custom order & visibility preferences
  const renderSection = (id) => {
    switch (id) {
      case 'hero':
        return <HeroExplode key={id} activeFlavor={activeFlavor} setActiveFlavor={setActiveFlavor} />
      case 'gallery':
        return <GallerySection key={id} />
      case 'blog':
        return <BlogSection key={id} />
      case 'mobile-features':
        return <MobileFeatureList key={id} />
      case 'story':
        return <AboutStory key={id} />
      case 'flavours':
        return <Flavours key={id} />
      case 'builder':
        return <BoxBuilder key={id} selectedBoxes={selectedBoxes} setSelectedBoxes={setSelectedBoxes} />
      case 'booking':
        return <BookingForm key={id} selectedBoxes={selectedBoxes} setSelectedBoxes={setSelectedBoxes} />
      case 'game':
        return <GameSection key={id} activeFlavor={activeFlavor} />
      case 'contact':
        return <ContactSection key={id} />
      default:
        return null
    }
  }

  // Sort sections list by order index
  const sortedSections = [...sectionsList]
    .sort((a, b) => a.order - b.order)
    .filter(s => s.visible !== false)

  return (
    <div id="top" className="bg-espresso min-h-screen text-ivory relative">
      {/* Luxury Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold to-blush z-[9999] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <Nav
        onAuthOpen={handleAuthOpen}
        onAccountOpen={() => setAccountModalOpen(true)}
        onAdminOpen={() => setAdminPanelOpen(true)}
      />

      <main>
        {sortedSections.map(s => renderSection(s.id))}
      </main>

      <Footer onAdminOpen={() => setAdminPanelOpen(true)} />

      {/* Auth Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />

      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />

      <AdminPanel
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
      />
    </div>
  )
}
