import { useState, useEffect, useRef } from 'react'
import './Fox.css'

// reactions when you click the fox
const REACTIONS = [
  '...', 'leave me alone', 'what?', 'zzz', '*yawns*',
  'i am thinking', 'no.', 'maybe later', 'go away', '🦊',
  'i am a fox btw', 'stop clicking', 'ok fine hi', '*wags tail*',
  'i can see your cursor', 'have you tried grass?',
]

// stars spread around the sky
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 55,
  delay: Math.random() * 2,
}))

export default function Fox() {
  const [time,     setTime]     = useState('day')     // day | sunset | night
  const [mood,     setMood]     = useState('idle')    // idle | blinking | sleeping | wagging
  const [bubble,   setBubble]   = useState(null)      // reaction text
  const [bubbleKey, setBubbleKey] = useState(0)

  const blinkRef  = useRef(null)
  const sleepRef  = useRef(null)
  const wagRef    = useRef(null)
  const bubbleRef = useRef(null)

  // random ambient behaviour loop
  useEffect(() => {
    function scheduleBehaviour() {
      const delay = 2000 + Math.random() * 5000
      blinkRef.current = setTimeout(() => {
        const roll = Math.random()
        if      (roll < 0.45) { setMood('blinking');  setTimeout(() => setMood('idle'), 200)  }
        else if (roll < 0.65) { setMood('sleeping');  setTimeout(() => setMood('idle'), 3000) }
        else if (roll < 0.82) { setMood('wagging');   setTimeout(() => setMood('idle'), 1500) }
        scheduleBehaviour()
      }, delay)
    }
    scheduleBehaviour()
    return () => clearTimeout(blinkRef.current)
  }, [])

  // clear bubble after 2.5 seconds
  function showBubble(text) {
    clearTimeout(bubbleRef.current)
    setBubble(text)
    setBubbleKey(k => k + 1)
    bubbleRef.current = setTimeout(() => setBubble(null), 2500)
  }

  // click the fox
  function handleFoxClick() {
    const reaction = REACTIONS[Math.floor(Math.random() * REACTIONS.length)]
    showBubble(reaction)
    setMood('blinking')
    setTimeout(() => setMood('idle'), 250)
  }

  // emoji based on mood
  const foxEmoji = mood === 'sleeping' ? '😴' : '🦊'

  return (
    <div className={`fox-root ${time}`}>

      {/* celestial body */}
      <div className="fox-celestial" />

      {/* stars (night only) */}
      <div className="fox-stars">
        {STARS.map(s => (
          <div key={s.id} className="fox-star" style={{
            left: `${s.x}%`,
            top:  `${s.y}%`,
            animationDelay: `${s.delay}s`,
          }} />
        ))}
      </div>

      {/* clouds (day only) */}
      <div className="fox-cloud" style={{ width: 120, height: 36, top: '15%', left: '12%' }} />
      <div className="fox-cloud" style={{ width: 90,  height: 28, top: '22%', left: '55%' }} />
      <div className="fox-cloud" style={{ width: 70,  height: 22, top: '10%', left: '35%' }} />

      {/* fox scene */}
      <div className="fox-scene" onClick={handleFoxClick}>
        {/* speech bubble */}
        {bubble && (
          <div key={bubbleKey} className="fox-bubble">{bubble}</div>
        )}

        {/* the fox */}
        <div
          className={`fox-emoji
            ${mood === 'blinking' ? 'blinking' : ''}
            ${mood === 'wagging'  ? 'wagging'  : ''}
          `}
        >
          {foxEmoji}
          {/* zzz when sleeping */}
          {mood === 'sleeping' && <span className="fox-zzz">💤</span>}
        </div>
      </div>

      {/* ground */}
      <div className="fox-ground" />

      {/* hint */}
      <p className="fox-hint">click the fox</p>

      {/* time of day selector */}
      <div className="fox-time-btns">
        {['day','sunset','night'].map(t => (
          <button
            key={t}
            className={`fox-time-btn ${time === t ? 'active' : ''}`}
            onClick={() => setTime(t)}
          >
            {t === 'day' ? '☀️ Day' : t === 'sunset' ? '🌅 Sunset' : '🌙 Night'}
          </button>
        ))}
      </div>
    </div>
  )
}