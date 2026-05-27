import { useState, useRef, useEffect } from 'react'
import { nanoid } from 'nanoid'
import Die from './Die'
import './Tenzies.css'

// generate a fresh set of 10 random dice
function generateAllNewDice() {
  return new Array(10).fill(0).map(() => ({
    value:  Math.ceil(Math.random() * 6),
    isHeld: false,
    id:     nanoid(),
  }))
}

export default function Tenzies() {
  const [dice, setDice] = useState(() => generateAllNewDice())
  const buttonRef = useRef(null)

  // game is won when every die is held AND all show the same value
  const gameWon = dice.every(d => d.isHeld) &&
                  dice.every(d => d.value === dice[0].value)

  // auto-focus the button when game is won (keyboard accessibility)
  useEffect(() => {
    if (gameWon) buttonRef.current?.focus()
  }, [gameWon])

  // roll unheld dice, or start a new game if already won
  function rollDice() {
    if (!gameWon) {
      setDice(prev => prev.map(die =>
        die.isHeld
          ? die
          : { ...die, value: Math.ceil(Math.random() * 6) }
      ))
    } else {
      setDice(generateAllNewDice())
    }
  }

  // toggle hold state on a die
  function hold(id) {
    setDice(prev => prev.map(die =>
      die.id === id ? { ...die, isHeld: !die.isHeld } : die
    ))
  }

  return (
    <div className="tz-root">
      <div className="tz-card">

        {/* win banner */}
        {gameWon && <div className="tz-win-banner">🎉 You Won!</div>}

        {/* accessibility announcement */}
        <div aria-live="polite" className="tz-sr-only">
          {gameWon && 'Congratulations! You won! Press New Game to start again.'}
        </div>

        <h1 className="tz-title">Tenzies</h1>
        <p className="tz-instructions">
          Roll until all dice are the same. Click each die to freeze it
          at its current value between rolls.
        </p>

        {/* dice */}
        <div className="tz-dice-grid">
          {dice.map(die => (
            <Die
              key={die.id}
              value={die.value}
              isHeld={die.isHeld}
              hold={() => hold(die.id)}
            />
          ))}
        </div>

        {/* roll / new game button */}
        <button
          ref={buttonRef}
          className={`tz-roll-btn ${gameWon ? 'won' : ''}`}
          onClick={rollDice}
        >
          {gameWon ? 'New Game' : 'Roll'}
        </button>

      </div>
    </div>
  )
}