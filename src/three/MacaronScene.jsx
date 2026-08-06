import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import MacaronPiece from './MacaronPiece'
import { FEATURES } from '../data/features'

// Geometry + color are visual/material concerns of the 3D piece; window + direction
// (the "when" and "where" of the explosion) live once in data/features.js so the
// cards and the mesh they belong to can never drift out of sync.
const PIECE_VISUALS = {
  shellTop:       { geometry: 'shell',   color: '#E3A6B4', rotY: [0, 0, 0] },
  shellBottom:    { geometry: 'shell',   color: '#E4C98A', rotY: [0, Math.PI, 0] },
  filling:        { geometry: 'filling', color: '#F1DCC0', rotY: [0, 0, 0] },
  crumbRose:      { geometry: 'crumb',   color: '#C97F92', rotY: [0, 0, 0] },
  crumbPistachio: { geometry: 'crumb',   color: '#8CA37C', rotY: [0, 0, 0] },
  crumbCocoa:     { geometry: 'crumb',   color: '#6B4A32', rotY: [0, 0, 0] },
}

const IDLE_SPEED = {
  shellTop: 0.9, shellBottom: 1.1, filling: 0.7,
  crumbRose: 1.4, crumbPistachio: 1.3, crumbCocoa: 1.5,
}

const FLAVOR_COLORS = [
  { shell: '#E3A6B4', filling: '#FFF5E4' }, // Rose (Rozūdens)
  { shell: '#8CA37C', filling: '#FFFDF9' }, // Pistachio (Pistācija)
  { shell: '#B4A5CC', filling: '#FDF6EE' }, // Lavender (Lavanda)
  { shell: '#6B4A32', filling: '#E4C98A' }, // Chocolate (Šokolāde)
  { shell: '#E4C98A', filling: '#FFFDF9' }, // Lemon (Citrons)
]

export default function MacaronScene({ progressRef, static: isStatic = false, flavorIndex = 0 }) {
  const activeColors = FLAVOR_COLORS[flavorIndex] || FLAVOR_COLORS[0]

  const getPieceColor = (pieceName, defaultColor) => {
    if (pieceName === 'shellTop' || pieceName === 'shellBottom') {
      return activeColors.shell
    }
    if (pieceName === 'filling') {
      return activeColors.filling
    }
    return defaultColor
  }

  return (
    <Canvas
      dpr={[1, isStatic ? 1.5 : 1.8]}
      camera={{ position: [0, 0.6, 5.2], fov: 38 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      shadows={!isStatic}
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[3, 5, 4]} angle={0.35} penumbra={0.6} intensity={2.4} color="#E4C98A" castShadow={!isStatic} />
      <spotLight position={[-4, 2, -3]} angle={0.5} penumbra={0.8} intensity={1.1} color="#E3A6B4" />

      <group>
        {FEATURES.map((f) => {
          const v = PIECE_VISUALS[f.piece]
          return (
            <group key={f.piece} rotation={v.rotY}>
              <MacaronPiece
                geometry={v.geometry}
                color={getPieceColor(f.piece, v.color)}
                direction={f.direction}
                window={f.window}
                idleSpeed={IDLE_SPEED[f.piece]}
                progressRef={progressRef}
              />
            </group>
          )
        })}
      </group>

      <Suspense fallback={null}>
        <Environment preset="apartment" environmentIntensity={0.6} />
      </Suspense>

      {!isStatic && <ContactShadows position={[0, -1.15, 0]} opacity={0.5} scale={10} blur={2.4} far={2} />}
    </Canvas>
  )
}
