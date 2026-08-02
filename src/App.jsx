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

export default function App() {
  useSmoothScroll()
  const { scrollYProgress } = useScroll()

  // State shared from BoxBuilder to BookingForm
  const [boxFlavors, setBoxFlavors] = useState([])

  // Active flavor state lifted to synchronize background colors across Hero and Game iframe
  const [activeFlavor, setActiveFlavor] = useState(0)

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState('login')
  const [accountModalOpen, setAccountModalOpen] = useState(false)

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
      />

      <main>
        {/* Cinematic 3D Hero Explosion Section */}
        <HeroExplode activeFlavor={activeFlavor} setActiveFlavor={setActiveFlavor} />

        {/* Responsive Mobile Layout features list */}
        <MobileFeatureList />

        {/* Our Story section */}
        <AboutStory />

        {/* Flavour gallery showcase */}
        <Flavours />

        {/* Interactive Box Builder (interactive 🎁 size picker and composition selector) */}
        <BoxBuilder onBoxChange={setBoxFlavors} />

        {/* Supabase booking and interactive monthly calendar form */}
        <BookingForm boxFlavors={boxFlavors} />

        {/* Embedded beautiful retro/procedural puzzle game */}
        <GameSection activeFlavor={activeFlavor} />

        {/* WhatsApp/Email details and styled Instagram CTA box */}
        <ContactSection />
      </main>

      <Footer />

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
    </div>
  )
}
