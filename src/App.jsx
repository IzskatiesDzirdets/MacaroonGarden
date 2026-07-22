import { useSmoothScroll } from './hooks/useSmoothScroll'
import Nav from './components/Nav'
import HeroExplode from './components/HeroExplode'
import MobileFeatureList from './components/MobileFeatureList'
import ClosingCTA from './components/ClosingCTA'
import Footer from './components/Footer'

export default function App() {
  useSmoothScroll()

  return (
    <div id="top" className="bg-espresso">
      <Nav />
      <main>
        <HeroExplode />
        <MobileFeatureList />
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  )
}
