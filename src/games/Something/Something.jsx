import { useState, useEffect, useRef } from 'react'
import './Something.css'

const BEEPS    = ['*beep*','...','bzzzt','?','——','ping','null','...loading']
const LOADINGS = ['loading...','please wait','connecting','initializing','hang on','one moment']

// random int between min and max
function rand(min, max) { return min + Math.floor(Math.random() * (max - min)) }

export default function Something() {
  // show the word "something"
  const [showWord,    setShowWord]    = useState(false)
  const [wordKey,     setWordKey]     = useState(0)    // re-trigger animation

  // tiny wandering dot position
  const [dotPos,      setDotPos]      = useState({ x: 50, y: 50 })  // percent

  // loading text events: array of { id, text, x, y, type }
  const [events,      setEvents]      = useState([])

  const timerRef  = useRef(null)
  const eventRef  = useRef(null)
  const dotRef    = useRef(null)
  const nextId    = useRef(0)

  // schedule next "something" appearance
  function scheduleWord() {
    const delay = rand(3000, 9000)
    timerRef.current = setTimeout(() => {
      setShowWord(true)
      setWordKey(k => k + 1)
      // hide after animation (2.4s) then schedule next
      setTimeout(() => {
        setShowWord(false)
        scheduleWord()
      }, 2500)
    }, delay)
  }

  // spawn random text events
  function scheduleEvent() {
    eventRef.current = setTimeout(() => {
      const id   = nextId.current++
      const type = Math.random() < 0.5 ? 'beep' : 'loading'
      const text = type === 'beep'
        ? BEEPS[rand(0, BEEPS.length)]
        : LOADINGS[rand(0, LOADINGS.length)]

      setEvents(prev => [...prev, {
        id, text, type,
        x: rand(5, 85),
        y: rand(10, 85),
      }])

      // remove after animation
      setTimeout(() => {
        setEvents(prev => prev.filter(e => e.id !== id))
      }, 1800)

      scheduleEvent()
    }, rand(1500, 4500))
  }

  // move the dot randomly every 2s
  function scheduleDot() {
    dotRef.current = setInterval(() => {
      setDotPos({
        x: rand(5, 95),
        y: rand(5, 95),
      })
    }, 2000)
  }

  useEffect(() => {
    scheduleWord()
    scheduleEvent()
    scheduleDot()
    return () => {
      clearTimeout(timerRef.current)
      clearTimeout(eventRef.current)
      clearInterval(dotRef.current)
    }
  }, [])

  return (
    <div className="some-root">

      {/* wandering dot */}
      <div
        className="some-dot"
        style={{ left: `${dotPos.x}%`, top: `${dotPos.y}%` }}
      />

      {/* random text events */}
      {events.map(e => (
        <span
          key={e.id}
          className={e.type === 'beep' ? 'some-beep' : 'some-loading'}
          style={{ left: `${e.x}%`, top: `${e.y}%` }}
        >
          {e.text}
        </span>
      ))}

      {/* the word */}
      {showWord && (
        <span key={wordKey} className="some-word">
          something
        </span>
      )}
    </div>
  )
}