import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

// Procedural Canvas PBR high-fidelity organic almond flour and cream bump map
let cachedBumpTexture = null;
function getPBRBumpMap() {
  if (cachedBumpTexture) return cachedBumpTexture;

  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  const imgData = ctx.createImageData(128, 128)
  for (let i = 0; i < imgData.data.length; i += 4) {
    const val = Math.floor(Math.random() * 255)
    imgData.data[i] = val     // R
    imgData.data[i + 1] = val // G
    imgData.data[i + 2] = val // B
    imgData.data[i + 3] = 255 // A
  }
  ctx.putImageData(imgData, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 3)
  cachedBumpTexture = tex
  return tex
}

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
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0)

  const sphereGeoRef = useRef()
  const feetGeoRef = useRef()

  // Perturb sphere vertices to create natural, non-perfect, wave-like handmade baked contours
  useEffect(() => {
    if (sphereGeoRef.current) {
      const pos = sphereGeoRef.current.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const y = pos.getY(i)
        const z = pos.getZ(i)
        const wave = Math.sin(x * 3.5) * Math.cos(z * 3.5) * 0.02
        pos.setY(i, y + wave)
      }
      sphereGeoRef.current.computeVertexNormals()
    }
  }, [])

  // Perturb torus vertices to represent bubbly, porous, organic "ruffled feet" ruffles
  useEffect(() => {
    if (feetGeoRef.current) {
      const pos = feetGeoRef.current.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const y = pos.getY(i)
        const z = pos.getZ(i)
        const noise = (Math.sin(x * 35) + Math.cos(z * 35)) * 0.015
        pos.setX(i, x + noise)
        pos.setY(i, y + noise)
      }
      feetGeoRef.current.computeVertexNormals()
    }
  }, [])

  return (
    <group>
      {/* dome */}
      <mesh castShadow receiveShadow scale={[1, 0.62, 1]}>
        <sphereGeometry ref={sphereGeoRef} args={isMobile ? [1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2] : [1, 64, 48, 0, Math.PI * 2, 0, Math.PI / 2]} />
        {isMobile ? (
          <meshStandardMaterial
            color={color}
            roughness={0.4}
            metalness={0.1}
            bumpMap={getPBRBumpMap()}
            bumpScale={0.012}
          />
        ) : (
          <meshPhysicalMaterial
            color={color}
            roughness={0.38}
            clearcoat={0.6}
            clearcoatRoughness={0.25}
            sheen={1}
            sheenColor={color}
            bumpMap={getPBRBumpMap()}
            bumpScale={0.018}
          />
        )}
      </mesh>
      {/* macaron "feet" ruffle at the base */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry ref={feetGeoRef} args={isMobile ? [1, 0.07, 6, 24] : [1, 0.07, 12, 96]} />
        {isMobile ? (
          <meshStandardMaterial color={color} roughness={0.6} bumpMap={getPBRBumpMap()} bumpScale={0.012} />
        ) : (
          <meshPhysicalMaterial color={color} roughness={0.55} clearcoat={0.3} bumpMap={getPBRBumpMap()} bumpScale={0.018} />
        )}
      </mesh>
    </group>
  )
}

function FillingMesh({ color }) {
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0)
  const fillingGeoRef = useRef()

  // Perturb cylinder vertices to represent whipped, bulging, organic creamy folds
  useEffect(() => {
    if (fillingGeoRef.current) {
      const pos = fillingGeoRef.current.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const y = pos.getY(i)
        const z = pos.getZ(i)
        const radial = Math.sqrt(x * x + z * z)
        if (radial > 0.1) {
          const angle = Math.atan2(z, x)
          const displace = (Math.sin(angle * 12) + Math.sin(y * 35)) * 0.02
          pos.setX(i, x + (x / radial) * displace)
          pos.setZ(i, z + (z / radial) * displace)
        }
      }
      fillingGeoRef.current.computeVertexNormals()
    }
  }, [])

  return (
    <mesh castShadow receiveShadow>
      <cylinderGeometry ref={fillingGeoRef} args={isMobile ? [0.92, 0.92, 0.34, 16] : [0.92, 0.92, 0.34, 64]} />
      {isMobile ? (
        <meshStandardMaterial color={color} roughness={0.3} bumpMap={getPBRBumpMap()} bumpScale={0.008} />
      ) : (
        <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={0.4} transmission={0.05} bumpMap={getPBRBumpMap()} bumpScale={0.012} />
      )}
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
