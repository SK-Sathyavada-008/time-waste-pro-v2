import { useState, useEffect, useRef } from 'react'
import './RainEffect.css'

const DROP_COUNT = 280    // number of rain drops

// create one raindrop with random properties
function makeDrop(W, H) {
  return {
    x:      Math.random() * W,
    y:      Math.random() * H - H,    // start above screen
    len:    8  + Math.random() * 18,  // drop length
    speed:  10 + Math.random() * 18,  // fall speed
    opacity: 0.25 + Math.random() * 0.55,
    width:  0.5 + Math.random() * 0.8,
  }
}

export default function RainEffect() {
  const canvasRef    = useRef(null)
  const mouseRef     = useRef({ x: 0.5, y: 0.5 })   // normalised 0-1
  const dropsRef     = useRef([])
  const rafRef       = useRef(null)
  const [lightning,  setLightning]  = useState(false)
  const lightKeyRef  = useRef(0)

  // schedule random lightning strikes
  useEffect(() => {
    function flash() {
      lightKeyRef.current++
      setLightning(true)
      setTimeout(() => setLightning(false), 200)
      // next flash in 4-14 seconds
      setTimeout(flash, 4000 + Math.random() * 10000)
    }
    const t = setTimeout(flash, 3000 + Math.random() * 5000)
    return () => clearTimeout(t)
  }, [])

  // track mouse position (normalised)
  useEffect(() => {
    function onMove(e) {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // main canvas draw loop
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    // set canvas resolution to match screen
    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      // re-init drops on resize
      dropsRef.current = Array.from(
        { length: DROP_COUNT },
        () => makeDrop(canvas.width, canvas.height)
      )
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      const W = canvas.width
      const H = canvas.height

      // wind tilt based on mouse X (range roughly -0.4 to +0.4)
      const tilt = (mouseRef.current.x - 0.5) * 0.8

      // clear with semi-transparent black for motion blur trail effect
      ctx.fillStyle = 'rgba(10, 14, 26, 0.45)'
      ctx.fillRect(0, 0, W, H)

      dropsRef.current = dropsRef.current.map(drop => {
        const { x, y, len, speed, opacity, width } = drop

        // draw the drop as a line tilted by wind
        ctx.beginPath()
        ctx.moveTo(x, y)
        // end point offset by tilt and length
        ctx.lineTo(x + tilt * len, y + len)
        ctx.strokeStyle = `rgba(174, 214, 241, ${opacity})`
        ctx.lineWidth   = width
        ctx.lineCap     = 'round'
        ctx.stroke()

        // move drop down (and sideways with wind)
        const nx = x + tilt * speed * 0.5
        const ny = y + speed

        // if drop exits the bottom, recycle it at the top
        if (ny > H + 20) {
          return {
            ...drop,
            x: Math.random() * W,
            y: -drop.len,
          }
        }

        // wrap horizontal
        return {
          ...drop,
          x: nx < -20 ? W + 10 : nx > W + 20 ? -10 : nx,
          y: ny,
        }
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="rain-root">
      <canvas ref={canvasRef} className="rain-canvas" />
      {lightning && (
        <div key={lightKeyRef.current} className="rain-lightning" />
      )}
    </div>
  )
}