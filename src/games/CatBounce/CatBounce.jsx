import { useState, useEffect, useRef } from 'react'
import './CatBounce.css'

// cat faces to pick from
const CAT_FACES = ['🐱','😺','😸','😹','😻','🙀','😼','😽']
const SFX       = ['meow','zoom','purr','brrr','mrrp','yeet','nya~','woop']

// pastel blob colours for background feel
const BG_COLORS = ['#ff9a9e','#a29bfe','#fd79a8','#fdcb6e','#6c5ce7','#00cec9','#e17055']

// create a new cat with random position, velocity, and face
function makeCat(id) {
  const W = window.innerWidth
  const H = window.innerHeight
  return {
    id,
    x:    80 + Math.random() * (W - 160),
    y:    80 + Math.random() * (H - 160),
    vx:   (Math.random() * 3 + 1.5) * (Math.random() < 0.5 ? 1 : -1),
    vy:   (Math.random() * 3 + 1.5) * (Math.random() < 0.5 ? 1 : -1),
    face: CAT_FACES[Math.floor(Math.random() * CAT_FACES.length)],
    sfx:  null,          // current sound text to show
    sfxKey: 0,           // changes on each bounce to re-trigger animation
    flip: false,         // mirror horizontally when moving left
  }
}

export default function CatBounce() {
  const [cats,    setCats]    = useState(() => Array.from({ length: 5 }, (_, i) => makeCat(i)))
  const nextIdRef = useRef(5)
  const rafRef    = useRef(null)
  const catsRef   = useRef(cats)    // ref so rAF loop reads latest

  catsRef.current = cats

  // spawn more cats
  function spawnCat() {
    const id = nextIdRef.current++
    setCats(prev => [...prev, makeCat(id)])
  }

  // animation loop
  useEffect(() => {
    const W = window.innerWidth
    const H = window.innerHeight
    const RADIUS = 28   // approx half-size of cat emoji

    function tick() {
      setCats(prev => prev.map(cat => {
        let { x, y, vx, vy, sfx, sfxKey, flip } = cat
        x += vx
        y += vy

        let bounced = false

        // bounce off left/right walls
        if (x - RADIUS < 0) {
          x  = RADIUS
          vx = Math.abs(vx)
          bounced = true
        } else if (x + RADIUS > W) {
          x  = W - RADIUS
          vx = -Math.abs(vx)
          bounced = true
        }

        // bounce off top/bottom (account for hud bar ~60px)
        if (y - RADIUS < 60) {
          y  = 60 + RADIUS
          vy = Math.abs(vy)
          bounced = true
        } else if (y + RADIUS > H) {
          y  = H - RADIUS
          vy = -Math.abs(vy)
          bounced = true
        }

        // show a sound effect on bounce
        if (bounced) {
          sfx    = SFX[Math.floor(Math.random() * SFX.length)]
          sfxKey = sfxKey + 1
        }

        // flip horizontally when moving left
        flip = vx < 0

        return { ...cat, x, y, vx, vy, sfx, sfxKey, flip }
      }))

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="cat-root">

      {/* background blobs for colour */}
      {BG_COLORS.map((c, i) => (
        <div key={i} className="cat-bg-deco" style={{
          width:  200 + i * 60,
          height: 200 + i * 60,
          background: c,
          top:  `${10 + i * 12}%`,
          left: `${5  + i * 13}%`,
        }} />
      ))}

      {/* hud */}
      <div className="cat-hud">
        <span className="cat-hud-title">🐱 Cat Bounce</span>
        <span className="cat-hud-count">{cats.length} cats</span>
        <button className="cat-spawn-btn" onClick={spawnCat}>+ Add Cat</button>
      </div>

      {/* render each cat */}
      {cats.map(cat => (
        <div
          key={cat.id}
          className="cat-entity"
          style={{ left: cat.x, top: cat.y }}
        >
          {/* sound text fades in/out on each bounce */}
          {cat.sfx && (
            <span key={cat.sfxKey} className="cat-sfx">{cat.sfx}</span>
          )}

          {/* the cat itself */}
          <div
            className="cat-face"
            style={{ transform: cat.flip ? 'scaleX(-1)' : 'scaleX(1)' }}
          >
            {cat.face}
          </div>
        </div>
      ))}
    </div>
  )
}