import { useState, useEffect } from 'react'
import './InfiniteCaptcha.css'

// ── data pools ─────────────────────────────────────────

// grid-based captcha challenges
const GRID_CHALLENGES = [
  { prompt: 'Select all images with a bicycle',        items: ['🚲','🚗','🏠','🌳','🚲','🐕','🚲','🛵','🚌'] },
  { prompt: 'Select all images with traffic lights',   items: ['🚦','🏪','🚦','🚗','🌲','🚦','🏠','🚲','🚕'] },
  { prompt: 'Select all images with fire hydrants',    items: ['🧯','🚗','🧯','🌳','🏠','🧯','🚲','🐕','🚌'] },
  { prompt: 'Select all images with a bus',            items: ['🚌','🚗','🌲','🚌','🏠','🚲','🚌','🐕','🚦'] },
  { prompt: 'Select all images with a crosswalk',      items: ['🚶','🚗','🚶','🌳','🏠','🚶','🚲','🚌','🚦'] },
  { prompt: 'Select all images with a motorcycle',     items: ['🏍','🚗','🌲','🏍','🏠','🚲','🏍','🐕','🚌'] },
  { prompt: 'Select all images with a mountain',       items: ['⛰','🚗','⛰','🌳','🏠','⛰','🚲','🐕','🚌'] },
  { prompt: 'Select all images with a boat',           items: ['⛵','🚗','⛵','🌳','🏠','⛵','🚲','🐕','🚌'] },
]

// text captcha challenges
const TEXT_CHALLENGES = [
  { prompt: 'Type the text you see below', code: 'X7K2M' },
  { prompt: 'Type the text you see below', code: 'R9P4W' },
  { prompt: 'Type the text you see below', code: 'B3N8Q' },
  { prompt: 'Type the text you see below', code: 'T5H1Z' },
  { prompt: 'Type the text you see below', code: 'Y6J0V' },
]

// rejection messages — always wrong no matter what
const REJECTIONS = [
  { title: 'Suspicious Activity Detected', msg: 'You are suspiciously human. Please try again.' },
  { title: 'Verification Failed',           msg: 'Robots have become smarter. You have not.' },
  { title: 'Not Quite',                     msg: 'Try again, organic life form.' },
  { title: 'Access Denied',                 msg: 'Our systems detect a 94% probability of consciousness.' },
  { title: 'Invalid Response',              msg: 'The bicycle you selected had feelings. Start over.' },
  { title: 'Error: Too Human',              msg: 'Please prove you are not made of carbon.' },
  { title: 'Challenge Failed',              msg: 'That traffic light was actually a star. Think harder.' },
  { title: 'Hmm...',                        msg: 'Our AI reviewed your choices and felt personally attacked.' },
  { title: 'Wrong Again',                   msg: 'The correct answer was none of them. There are no bicycles here.' },
  { title: 'Security Alert',                msg: 'You blinked during the challenge. Disqualified.' },
]

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)] }

export default function InfiniteCaptcha() {
  // which challenge type: 'grid' or 'text'
  const [type,       setType]       = useState('grid')
  const [challenge,  setChallenge]  = useState(() => randomFrom(GRID_CHALLENGES))
  const [selected,   setSelected]   = useState([])        // selected tile indices
  const [textVal,    setTextVal]     = useState('')
  const [rejection,  setRejection]  = useState(null)      // { title, msg }
  const [attempts,   setAttempts]   = useState(0)

  // pick a fresh random challenge (alternate types to keep it fresh)
  function nextChallenge() {
    const newType = Math.random() < 0.65 ? 'grid' : 'text'
    setType(newType)
    setChallenge(newType === 'grid'
      ? randomFrom(GRID_CHALLENGES)
      : randomFrom(TEXT_CHALLENGES)
    )
    setSelected([])
    setTextVal('')
    setRejection(null)
  }

  // toggle tile selection
  function toggleTile(i) {
    setSelected(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    )
  }

  // always reject no matter what
  function handleVerify() {
    setAttempts(a => a + 1)
    setRejection(randomFrom(REJECTIONS))
  }

  return (
    <div className="cap-root">

      <div className="cap-card">
        <div className="cap-card-header">
          <div className="cap-prompt">{challenge.prompt}</div>
          <div className="cap-sub">
            {type === 'grid'
              ? 'Click verify once there are none left.'
              : 'If there is no text, click verify.'}
          </div>
        </div>

        {/* grid challenge */}
        {type === 'grid' && (
          <div className="cap-grid">
            {challenge.items.map((emoji, i) => (
              <div
                key={i}
                className={`cap-tile ${selected.includes(i) ? 'selected' : ''}`}
                onClick={() => toggleTile(i)}
              >
                {emoji}
              </div>
            ))}
          </div>
        )}

        {/* text challenge */}
        {type === 'text' && (
          <div style={{ padding: '16px' }}>
            <div className="cap-distorted">{challenge.code}</div>
            <input
              className="cap-text-input"
              placeholder="Type here..."
              value={textVal}
              onChange={e => setTextVal(e.target.value)}
            />
          </div>
        )}

        <div className="cap-footer">
          <div className="cap-logo">
            <span>reCAPTCHA</span>
            Privacy · Terms
          </div>
          <button className="cap-verify-btn" onClick={handleVerify}>
            Verify
          </button>
        </div>
      </div>

      <div className="cap-attempts">
        {attempts > 0 ? `${attempts} failed attempt${attempts > 1 ? 's' : ''}` : 'prove you exist'}
      </div>

      {/* rejection overlay */}
      {rejection && (
        <div className="cap-result">
          <div className="cap-result-box">
            <div className="cap-result-icon">🤖</div>
            <h3>{rejection.title}</h3>
            <p>{rejection.msg}</p>
            <button className="cap-try-btn" onClick={nextChallenge}>
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}