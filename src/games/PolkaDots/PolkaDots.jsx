import { useState, useEffect, useRef, useCallback } from 'react'
import './PolkaDots.css'

// ── constants ──────────────────────────────────────────
const ENEMY_COUNT    = 6      // how many enemies on screen
const FOOD_COUNT     = 8      // how many food dots on screen
const ENEMY_SPEED    = 1.2    // pixels per frame
const FOOD_RADIUS    = 7      // size of food dots
const PLAYER_START   = 18     // starting radius of player

// pretty colours for food dots
const FOOD_COLORS = ['#f1c40f','#2ecc71','#3498db','#9b59b6','#1abc9c','#e67e22','#e91e63','#00bcd4']
// enemy colours
const ENEMY_COLORS = ['#e74c3c','#ff5722','#f44336','#e53935','#c62828','#ff1744']

// generate a random food dot not overlapping the player start position
function randomFood(id) {
  return {
    id,
    x: 60 + Math.random() * (window.innerWidth  - 120),
    y: 60 + Math.random() * (window.innerHeight - 120),
    r: FOOD_RADIUS,
    color: FOOD_COLORS[Math.floor(Math.random() * FOOD_COLORS.length)],
  }
}

// generate a random enemy that starts near an edge
function randomEnemy(id) {
  const side = Math.floor(Math.random() * 4)
  let x, y
  if (side === 0) { x = Math.random() * window.innerWidth;  y = -20 }
  if (side === 1) { x = Math.random() * window.innerWidth;  y = window.innerHeight + 20 }
  if (side === 2) { x = -20;                                 y = Math.random() * window.innerHeight }
  if (side === 3) { x = window.innerWidth + 20;              y = Math.random() * window.innerHeight }
  const angle = Math.random() * Math.PI * 2
  return {
    id,
    x, y,
    r: 14 + Math.random() * 12,
    vx: Math.cos(angle) * ENEMY_SPEED,
    vy: Math.sin(angle) * ENEMY_SPEED,
    color: ENEMY_COLORS[Math.floor(Math.random() * ENEMY_COLORS.length)],
  }
}

// distance between two circles
function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export default function PolkaDots() {
  // mouse position = player position
  const [playerPos, setPlayerPos]   = useState({ x: window.innerWidth/2, y: window.innerHeight/2 })
  const [playerR,   setPlayerR]     = useState(PLAYER_START)
  const [foods,     setFoods]       = useState(() => Array.from({ length: FOOD_COUNT }, (_, i) => randomFood(i)))
  const [enemies,   setEnemies]     = useState(() => Array.from({ length: ENEMY_COUNT }, (_, i) => randomEnemy(i)))
  const [score,     setScore]       = useState(0)
  const [gameOver,  setGameOver]    = useState(false)

  // refs so the animation loop always reads latest values
  const stateRef = useRef({})
  stateRef.current = { playerPos, playerR, foods, enemies, score, gameOver }

  const foodIdRef = useRef(FOOD_COUNT)
  const rafRef    = useRef(null)

  // track mouse
  const handleMouseMove = useCallback((e) => {
    if (!stateRef.current.gameOver) {
      setPlayerPos({ x: e.clientX, y: e.clientY })
    }
  }, [])

  // main game loop
  const tick = useCallback(() => {
    const { playerPos, playerR, foods, enemies, gameOver } = stateRef.current
    if (gameOver) return

    // ── move enemies ──────────────────────────────────
    setEnemies(prev => prev.map(e => {
      let { x, y, vx, vy } = e
      x += vx; y += vy
      // bounce off walls
      if (x < -50 || x > window.innerWidth  + 50) vx = -vx
      if (y < -50 || y > window.innerHeight + 50) vy = -vy
      // slowly drift toward player (mild homing)
      const dx = playerPos.x - x
      const dy = playerPos.y - y
      const d  = Math.hypot(dx, dy) || 1
      vx += (dx / d) * 0.015
      vy += (dy / d) * 0.015
      // clamp speed
      const speed = Math.hypot(vx, vy)
      if (speed > ENEMY_SPEED * 1.8) { vx = (vx/speed)*ENEMY_SPEED*1.8; vy = (vy/speed)*ENEMY_SPEED*1.8 }
      return { ...e, x, y, vx, vy }
    }))

    // ── check food collision ──────────────────────────
    setFoods(prev => {
      const remaining = []
      let ate = 0
      prev.forEach(f => {
        if (dist(f, playerPos) < playerR + f.r) {
          ate++  // eaten — don't keep it
        } else {
          remaining.push(f)
        }
      })
      if (ate > 0) {
        setScore(s => s + ate)
        setPlayerR(r => r + ate * 2)           // grow player
        // spawn replacements
        const newFood = Array.from({ length: ate }, () => {
          foodIdRef.current++
          return randomFood(foodIdRef.current)
        })
        return [...remaining, ...newFood]
      }
      return prev
    })

    // ── check enemy collision ─────────────────────────
    const hit = stateRef.current.enemies.some(e => dist(e, playerPos) < playerR + e.r - 6)
    if (hit) {
      setGameOver(true)
      return
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  // start/restart game
  function startGame() {
    setPlayerPos({ x: window.innerWidth/2, y: window.innerHeight/2 })
    setPlayerR(PLAYER_START)
    setScore(0)
    setGameOver(false)
    foodIdRef.current = FOOD_COUNT
    setFoods(Array.from({ length: FOOD_COUNT }, (_, i) => randomFood(i)))
    setEnemies(Array.from({ length: ENEMY_COUNT }, (_, i) => randomEnemy(i)))
  }

  // kick off loop
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [handleMouseMove, tick])

  // restart loop after game over cleared
  useEffect(() => {
    if (!gameOver) {
      rafRef.current = requestAnimationFrame(tick)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [gameOver, tick])

  return (
    <div className="polka-root">
      {/* HUD */}
      <div className="polka-hud">
        score <span className="score-val">{score}</span>
      </div>

      {/* player circle */}
      <div
        className="polka-circle"
        style={{
          width:  playerR * 2,
          height: playerR * 2,
          left:   playerPos.x,
          top:    playerPos.y,
          background: 'radial-gradient(circle at 35% 35%, #74ebd5, #3498db)',
          boxShadow: `0 0 ${playerR}px rgba(52,152,219,0.5)`,
          zIndex: 5,
          transition: 'width 0.1s, height 0.1s',
        }}
      />

      {/* food dots */}
      {foods.map(f => (
        <div
          key={f.id}
          className="polka-circle"
          style={{
            width:  f.r * 2,
            height: f.r * 2,
            left:   f.x,
            top:    f.y,
            background: f.color,
            boxShadow: `0 0 8px ${f.color}`,
          }}
        />
      ))}

      {/* enemy circles */}
      {enemies.map(e => (
        <div
          key={e.id}
          className="polka-circle"
          style={{
            width:  e.r * 2,
            height: e.r * 2,
            left:   e.x,
            top:    e.y,
            background: `radial-gradient(circle at 35% 35%, #ff6b6b, ${e.color})`,
            boxShadow: `0 0 12px ${e.color}88`,
          }}
        />
      ))}

      {/* game over screen */}
      {gameOver && (
        <div className="polka-over">
          <h2>Dead.</h2>
          <p className="final-score">Score — {stateRef.current.score}</p>
          <p>You got eaten by a circle. Classic.</p>
          <button className="polka-restart" onClick={startGame}>Try Again</button>
        </div>
      )}
    </div>
  )
}