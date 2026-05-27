import { useState } from 'react'
import './RiggedRPS.css'

// ── data ───────────────────────────────────────────────
const CHOICES = [
  { id: 'rock',     emoji: '🪨', label: 'Rock'     },
  { id: 'paper',    emoji: '📄', label: 'Paper'    },
  { id: 'scissors', emoji: '✂️', label: 'Scissors' },
]

// computer always plays the move that BEATS the player's move
const BEATS = {
  rock:     'paper',      // paper beats rock
  paper:    'scissors',   // scissors beats paper
  scissors: 'rock',       // rock beats scissors
}

// funny explanations — always from computer's perspective winning
const EXPLANATIONS = {
  rock: [
    "Paper filed a restraining order against Rock.",
    "Paper had better Wi-Fi and won on a technicality.",
    "Rock tried but Paper had a lawyer.",
    "Paper wrapped Rock in bureaucracy. Rock suffocated.",
  ],
  paper: [
    "Scissors were disqualified for tax fraud.",
    "Paper hired Scissors as an intern. Conflict of interest.",
    "Scissors left early for a dentist appointment.",
    "Scissors forgot to show up. Classic Scissors.",
  ],
  scissors: [
    "Rock was on steroids. Case closed.",
    "Scissors filed an appeal. Rock denied it.",
    "Rock had a gym membership. Scissors didn't.",
    "Rock had plot armour. Nothing to be done.",
  ],
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function RiggedRPS() {
  const [playerChoice,   setPlayerChoice]   = useState(null)
  const [computerChoice, setComputerChoice] = useState(null)
  const [explanation,    setExplanation]    = useState('')
  const [computerScore,  setComputerScore]  = useState(0)
  const [reveal,         setReveal]         = useState(false)

  function play(choiceId) {
    const winning = BEATS[choiceId]                 // computer always plays the winning move
    const computerEmoji = CHOICES.find(c => c.id === winning)

    setPlayerChoice(choiceId)
    setComputerChoice(winning)
    setExplanation(randomFrom(EXPLANATIONS[choiceId]))
    setComputerScore(s => s + 1)
    setReveal(false)
    // tiny delay so the animation re-triggers
    setTimeout(() => setReveal(true), 10)
  }

  const playerEmoji   = playerChoice   ? CHOICES.find(c => c.id === playerChoice).emoji   : '❓'
  const computerEmoji = computerChoice ? CHOICES.find(c => c.id === computerChoice).emoji : '❓'

  return (
    <div className="rps-root">

      {/* score board */}
      <div className="rps-scores">
        <div className="rps-score-box">
          <div className="label">You</div>
          <div className="val">0</div>
        </div>
        <div className="rps-divider">:</div>
        <div className="rps-score-box computer">
          <div className="label">Computer</div>
          <div className="val">{computerScore}</div>
        </div>
      </div>

      {/* arena */}
      <div className="rps-arena">
        <div className="rps-fighter">
          <span className="tag">You</span>
          <div className={`rps-emoji ${reveal ? 'reveal' : ''}`}>{playerEmoji}</div>
        </div>

        <div className="rps-vs">VS</div>

        <div className="rps-fighter">
          <span className="tag">Computer</span>
          <div className={`rps-emoji ${reveal ? 'reveal' : ''}`}>{computerEmoji}</div>
        </div>
      </div>

      {/* result */}
      <div className="rps-result">
        {computerChoice ? '💀 You Lose. Again.' : 'Choose your fate'}
      </div>

      {/* funny explanation */}
      <div className="rps-explanation">
        {explanation}
      </div>

      {/* choice buttons */}
      <div className="rps-choices">
        {CHOICES.map(c => (
          <button
            key={c.id}
            className="rps-choice-btn"
            onClick={() => play(c.id)}
          >
            <span className="choice-emoji">{c.emoji}</span>
            <span className="choice-label">{c.label}</span>
          </button>
        ))}
      </div>

      <p className="rps-notice">the computer has never lost. ever.</p>
    </div>
  )
}