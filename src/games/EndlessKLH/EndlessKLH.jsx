import { useState, useEffect, useRef } from 'react'
import './EndlessKLH.css'

// ── zone definitions ───────────────────────────────────
// These repeat (with shuffled events) to create the illusion of endlessness
const ZONE_TEMPLATES = [
  {
    icon: '🏛',
    title: 'Main Gate',
    sub: 'You entered with hope.\nThat was your first mistake.',
    events: [
      { type: 'info',    text: 'Security: "H3-09? That\'s in the other block."', pos: { top: '20%', left: '65%' } },
      { type: 'funny',   text: '👀 Student staring at notice board since 2019', pos: { bottom: '25%', left: '10%' } },
    ]
  },
  {
    icon: '🚪',
    title: 'Corridor A',
    sub: 'All doors lead to other corridors.\nThis is known.',
    events: [
      { type: 'warning', text: '⚠ ATTENDANCE: 23%\nConsider existing elsewhere', pos: { top: '15%', right: '8%' } },
      { type: 'funny',   text: '🚶 "Just 5 more minutes" — said 40 minutes ago', pos: { bottom: '30%', left: '5%' } },
    ]
  },
  {
    icon: '🪜',
    title: 'Staircase B',
    sub: 'This goes up.\nH3-09 does not.',
    events: [
      { type: 'info',    text: 'Faculty: "H3-09 doesn\'t exist yet technically"', pos: { top: '25%', left: '60%' } },
      { type: 'warning', text: '⚠ Wrong Block\nPlease return to start', pos: { bottom: '20%', right: '10%' } },
    ]
  },
  {
    icon: '📚',
    title: 'Library Area',
    sub: '"Read the timetable" — it doesn\'t list H3-09.',
    events: [
      { type: 'funny',   text: '📖 Student asleep. Book open. Respectable.', pos: { top: '20%', left: '5%' } },
      { type: 'info',    text: 'Librarian: "I\'ve heard of H3-09.\nI don\'t speak of it."', pos: { bottom: '28%', right: '5%' } },
    ]
  },
  {
    icon: '🍜',
    title: 'Canteen',
    sub: 'You stop for sambar rice.\nH3-09 is not here either.',
    events: [
      { type: 'funny',   text: '🧑‍🍳 "Extra rice?" No. You have places to be.', pos: { top: '18%', right: '8%' } },
      { type: 'warning', text: '⚠ 3 min left for class\nYou are very far away', pos: { bottom: '22%', left: '6%' } },
    ]
  },
  {
    icon: '🔬',
    title: 'Lab Block',
    sub: 'Experiments in progress.\nNone of them are finding H3-09.',
    events: [
      { type: 'info',    text: 'Lab assistant: "Try the H block. No, the other H block."', pos: { top: '22%', left: '55%' } },
      { type: 'funny',   text: '🧪 Someone spilled something.\nNot your problem.', pos: { bottom: '30%', left: '4%' } },
    ]
  },
  {
    icon: '🌳',
    title: 'Back Campus',
    sub: 'You have gone too far.\nAnd yet, not far enough.',
    events: [
      { type: 'warning', text: '⚠ H3-09 is not outside\nPlease go inside\nThen go outside again', pos: { top: '20%', right: '6%' } },
      { type: 'funny',   text: '🐦 Bird knows where H3-09 is.\nRefuses to say.', pos: { bottom: '25%', left: '8%' } },
    ]
  },
  {
    icon: '🏗',
    title: 'Under Construction',
    sub: 'Will be H3-09.\nEstimated completion: never.',
    events: [
      { type: 'info',    text: '🚧 "Sir said it\'s in the new block."\n"There is no new block."', pos: { top: '15%', left: '60%' } },
      { type: 'warning', text: '⚠ HAZARD: Hope detected\nPlease extinguish', pos: { bottom: '20%', left: '5%' } },
    ]
  },
]

// funny signs scattered through zones
const WRONG_SIGNS = [
  '← H3-09',
  'H3-09 →',
  'H3-09 ↑',
  'H3-09 (this floor)',
  'H3-09 (NOT THIS FLOOR)',
]

// generate a large pool of zones by repeating templates
function buildZones(count) {
  const zones = []
  for (let i = 0; i < count; i++) {
    const template = ZONE_TEMPLATES[i % ZONE_TEMPLATES.length]
    zones.push({ ...template, id: i, signText: WRONG_SIGNS[i % WRONG_SIGNS.length] })
  }
  return zones
}

const TOTAL_ZONES = 40   // effectively endless for any human
const ZONES = buildZones(TOTAL_ZONES)

export default function EndlessKLH() {
  const [scrollY,   setScrollY]   = useState(0)
  const [distance,  setDistance]  = useState(0)   // metres "walked"
  const worldRef    = useRef(null)
  const containerRef = useRef(null)

  // listen to scroll on the container div
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function onScroll() {
      const s = el.scrollTop
      setScrollY(s)
      setDistance(Math.floor(s / 4))   // 1 metre per 4px scroll
    }

    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="klh-root"
      ref={containerRef}
      style={{ overflowY: 'scroll' }}
    >
      {/* fixed top bar */}
      <div className="klh-topbar">
        <div className="klh-destination">
          Going to <span>H3-09</span>
        </div>
        <div className="klh-distance">{distance}m walked</div>
      </div>

      {/* the scrollable world */}
      <div
        className="klh-world"
        ref={worldRef}
        style={{ height: `${TOTAL_ZONES * 100}vh` }}
      >
        {ZONES.map((zone, i) => (
          <div key={zone.id} className="klh-zone">

            {/* zone type label */}
            <div className="klh-zone-label">Zone {i + 1}</div>

            {/* main icon and text */}
            <div className="klh-zone-icon">{zone.icon}</div>
            <div className="klh-zone-title">{zone.title}</div>
            <div className="klh-zone-sub">{zone.sub}</div>

            {/* directional sign */}
            <div className="klh-sign" style={{ marginTop: 20 }}>
              {zone.signText}
              <small>KLH University — Campus Navigation</small>
            </div>

            {/* scattered event cards */}
            {zone.events.map((ev, j) => (
              <div
                key={j}
                className={`klh-event ${ev.type}`}
                style={ev.pos}
              >
                {ev.text}
              </div>
            ))}

            {/* closed door on some zones */}
            {i % 3 === 0 && (
              <div className="klh-door" style={{ bottom: '12%', right: '15%' }}>
                <span style={{ fontSize: '2.5rem' }}>🚪</span>
                <span>Locked</span>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* scroll hint — hide after user starts scrolling */}
      {scrollY < 80 && (
        <div className="klh-scroll-hint">↓ scroll to find H3-09</div>
      )}
    </div>
  )
}