import { useEffect, useState } from 'react'
import { useCMS } from '../hooks/useCMS'
import gameHtml from '../game.html?raw'

const FLAVOR_BACKGROUNDS = [
  'radial-gradient(120% 90% at 50% -10%, #FFFDF9 0%, #FAEDF0 55%, #F5D5E0 100%)', // Rose
  'radial-gradient(120% 90% at 50% -10%, #FFFDF9 0%, #EBF4EE 55%, #D4EDE6 100%)', // Pistachio
  'radial-gradient(120% 90% at 50% -10%, #FFFDF9 0%, #F2EBF7 55%, #E8E0F0 100%)', // Lavender
  'radial-gradient(120% 90% at 50% -10%, #FFFDF9 0%, #FAF3EC 55%, #F0E6D8 100%)', // Chocolate
  'radial-gradient(120% 90% at 50% -10%, #FFFDF9 0%, #FAFAEC 55%, #F5F2D8 100%)', // Lemon
]

const FLAVOR_THEMES = [
  { primary: '#C97A96', secondary: '#E8A4B8' }, // Rose
  { primary: '#6FA87A', secondary: '#A8D4B0' }, // Pistachio
  { primary: '#9A85BE', secondary: '#C8B8DC' }, // Lavender
  { primary: '#8B5E3C', secondary: '#C4956A' }, // Chocolate
  { primary: '#C8C038', secondary: '#EEE880' }, // Lemon
]

export default function GameSection({ activeFlavor = 0 }) {
  const { gameConfig, addRewardCode, rewardCodes } = useCMS()
  const [unlockedReward, setUnlockedReward] = useState(null)

  // Listen for score or quiz milestones sent from the iframe
  useEffect(() => {
    const handleGameMessage = (e) => {
      if (!e.data) return

      if (e.data.type === 'QUIZ_COMPLETE') {
        const correct = e.data.correct
        if (correct >= gameConfig.quizMilestone) {
          const promo = 'QUIZ' + Math.floor(Math.random() * 900 + 100)
          addRewardCode(promo, 'speltajs@gmail.com', `Viktorīna ${correct}/5 Pareizi`)
          setUnlockedReward({ code: promo, reward: 'Bezmaksas makarūns par zināšanām! 🍬' })
        }
      }

      if (e.data.type === 'ENDLESS_SCORE') {
        const score = e.data.score
        if (score >= gameConfig.scoreMilestone) {
          const promo = 'SCORE' + Math.floor(Math.random() * 900 + 100)
          // Avoid duplicate triggers per game
          const alreadyClaimed = rewardCodes.some(c => c.code.startsWith('SCORE') && c.reward.includes(String(score)))
          if (!alreadyClaimed) {
            addRewardCode(promo, 'speltajs@gmail.com', `Sasniegts rezultāts: ${score}`)
            setUnlockedReward({ code: promo, reward: `${gameConfig.scoreMilestone} punktu sasniegums! ⭐` })
          }
        }
      }
    }

    window.addEventListener('message', handleGameMessage)
    return () => window.removeEventListener('message', handleGameMessage)
  }, [gameConfig, rewardCodes])

  // Inject postMessage script into game html
  const injectedScript = `
    <script>
      // Post quiz scores to parent
      const originalFinishQuiz = window.finishQuiz;
      window.finishQuiz = function() {
        if (originalFinishQuiz) originalFinishQuiz();
        try {
          window.parent.postMessage({ type: 'QUIZ_COMPLETE', correct: window.quizCorrect }, '*');
        } catch(e){}
      };

      // Post endless score triggers
      const originalAddScore = window.addScore;
      window.addScore = function(n) {
        if (originalAddScore) originalAddScore(n);
        try {
          window.parent.postMessage({ type: 'ENDLESS_SCORE', score: window.score }, '*');
        } catch(e){}
      }
    </script>
  `

  // Dynamically override css variables and body background inside gameHtml so the game
  // skin completely matches the selected pastry flavor.
  const customGameHtml = gameHtml
    .replace('</head>', `<style>
      :root {
        --rose-d: ${FLAVOR_THEMES[activeFlavor].primary} !important;
        --rose: ${FLAVOR_THEMES[activeFlavor].secondary} !important;
      }
      body {
        background: ${FLAVOR_BACKGROUNDS[activeFlavor]} !important;
      }
    </style>${injectedScript}</head>`)

  return (
    <section id="game" className="bg-espresso-2 px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        {/* Header */}
        <div className="mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">Atpūtas brīdis</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.9rem)] text-ivory">
            Makarūnu <em className="italic text-blush">Mozaīka</em>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-ivory-dim">
            Atpūties un uzspēlē mūsu bezgalīgo, relaksējošo puzles spēli. Sasniedz {gameConfig.scoreMilestone} punktus vai pareizi atbildi uz {gameConfig.quizMilestone} jautājumiem viktorīnā, lai saņemtu savu dāvanu kodu!
          </p>
        </div>

        {/* Claimed Reward Modal / Banner */}
        {unlockedReward && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 max-w-[480px] mx-auto rounded-2xl border border-gold/30 bg-gold/15 p-5 text-center shadow-xl relative"
          >
            <button
              onClick={() => setUnlockedReward(null)}
              className="absolute top-3 right-3 text-xs text-gold font-bold hover:text-gold-soft cursor-pointer"
            >
              ✕
            </button>
            <span className="text-2xl block mb-1">🎁 Apsveicam!</span>
            <h4 className="font-display font-semibold text-base text-gold">Sasniegums Atbloķēts!</h4>
            <p className="text-xs text-ivory-dim mt-1">{unlockedReward.reward}</p>
            <div className="mt-3 inline-block rounded-lg bg-gold text-espresso font-mono text-sm px-4 py-1.5 font-bold tracking-wider">
              KODS: {unlockedReward.code}
            </div>
            <p className="text-[10px] text-gold/70 mt-2">Ievadi šo kodu papildu vēlmēs, veicot pasūtījumu!</p>
          </motion.div>
        )}

        {/* Frame container */}
        <div className="mx-auto max-w-[480px] overflow-hidden rounded-3xl border border-white/10 bg-espresso-3 shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 ring-gold/15 h-[min(78vh,680px)]">
          <iframe
            srcDoc={customGameHtml}
            title="Makarūnu Mozaīka"
            className="h-full w-full border-none block"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
