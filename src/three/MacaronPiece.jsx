import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

/**
 * geometry: 'shell' | 'filling' | 'crumb'
 * direction: [x,y,z] the piece travels toward as it explodes
 * window: [start, end] slice of the overall 0..1 scroll progress during which
 *         this piece animates (pieces explode in a staggered sequence, not all at once)
 * progressRef: mutable ref (never triggers React re-render) holding current
 *              overall scroll progress, updated by the parent's GSAP timeline
 */
export default function MacaronPiece({ geometry, color, direction, window, progressRef, idleSpeed = 1 }) {
  const group = useRef()
  const [wStart, wEnd] = window

  useFrame((state, delta) => {
    if (!group.current) return
    const overall = progressRef.current
    const local = THREE.MathUtils.clamp((overall - wStart) / (wEnd - wStart), 0, 1)
    const eased = easeOutCubic(local)

    const calm = 1 - overall * 0.85 // idle bobbing settles down as the piece explodes
    const t = state.clock.elapsedTime

    group.current.position.x = direction[0] * eased + Math.sin(t * 0.6 * idleSpeed) * 0.06 * calm
    group.current.position.y = direction[1] * eased + Math.sin(t * 0.8 * idleSpeed + 1) * 0.07 * calm
    group.current.position.z = direction[2] * eased + Math.cos(t * 0.5 * idleSpeed) * 0.06 * calm

    group.current.rotation.x = eased * (direction[1] > 0 ? 0.6 : -0.6) + Math.sin(t * 0.3) * 0.05 * calm
    group.current.rotation.y += delta * 0.15 * idleSpeed * (0.3 + calm * 0.7)
  })

  return (
    <group ref={group}>
      {geometry === 'shell' && <ShellMesh color={color} />}
      {geometry === 'filling' && <FillingMesh color={color} />}
      {geometry === 'crumb' && <CrumbMesh color={color} />}
    </group>
  )
}

function ShellMesh({ color }) {
  return (
    <group>
      {/* dome */}
      <mesh castShadow receiveShadow scale={[1, 0.62, 1]}>
        <sphereGeometry args={[1, 64, 48, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.38}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
          sheen={1}
          sheenColor={color}
        />
      </mesh>
      {/* macaron "feet" ruffle at the base */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.07, 12, 96]} />
        <meshPhysicalMaterial color={color} roughness={0.55} clearcoat={0.3} />
      </mesh>
    </group>
  )
}

function FillingMesh({ color }) {
  return (
    <mesh castShadow receiveShadow>
      <cylinderGeometry args={[0.92, 0.92, 0.34, 64]} />
      <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={0.4} transmission={0.05} />
    </mesh>
  )
}

function CrumbMesh({ color }) {
  return (
    <mesh castShadow receiveShadow>
      <icosahedronGeometry args={[0.22, 1]} />
      <meshPhysicalMaterial color={color} roughness={0.5} flatShading />
    </mesh>
  )
}
