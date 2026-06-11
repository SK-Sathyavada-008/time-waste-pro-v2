import { useState } from 'react'
import { clsx } from 'clsx'
import { languages }                    from './languages'
import { getFarewellText, getRandomWord } from './utils'
import './Endgame.css'

export default function Endgame() {
  const [currentWord,     setCurrentWord]     = useState(() => getRandomWord())
  const [guessedLetters,  setGuessedLetters]  = useState([])

  // ── derived values ─────────────────────────────────
  const numGuessesLeft      = languages.length - 1
  const wrongGuessCount     = guessedLetters.filter(l => !currentWord.includes(l)).length
  const isGameWon           = currentWord.split('').every(l => guessedLetters.includes(l))
  const isGameLost          = wrongGuessCount >= numGuessesLeft
  const isGameOver          = isGameWon || isGameLost
  const lastGuessed         = guessedLetters[guessedLetters.length - 1]
  const isLastGuessWrong    = lastGuessed && !currentWord.includes(lastGuessed)

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'

  // ── actions ────────────────────────────────────────
  function addGuess(letter) {
    setGuessedLetters(prev =>
      prev.includes(letter) ? prev : [...prev, letter]
    )
  }

  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  // ── status banner ──────────────────────────────────
  const statusClass = clsx('eg-status', {
    won:      isGameWon,
    lost:     isGameLost,
    farewell: !isGameOver && isLastGuessWrong,
  })

  function renderStatus() {
    if (!isGameOver && isLastGuessWrong) {
      return (
        <p className="farewell-msg">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      )
    }
    if (isGameWon) return <><h2>You win!</h2><p>Well done! 🎉</p></>
    if (isGameLost) return <><h2>Game over!</h2><p>Better start learning Assembly! 😅</p></>
    return null
  }

  // ── render helpers ─────────────────────────────────
  const chipElements = languages.map((lang, i) => (
    <span
      key={lang.name}
      className={clsx('eg-chip', i < wrongGuessCount && 'lost')}
      style={{ backgroundColor: lang.backgroundColor, color: lang.color }}
    >
      {lang.name}
    </span>
  ))

  const wordElements = currentWord.split('').map((letter, i) => {
    const revealed = isGameLost || guessedLetters.includes(letter)
    return (
      <span
        key={i}
        className={clsx(isGameLost && !guessedLetters.includes(letter) && 'missed')}
      >
        {revealed ? letter.toUpperCase() : ''}
      </span>
    )
  })

  const keyboardElements = alphabet.split('').map(letter => {
    const isGuessed  = guessedLetters.includes(letter)
    const isCorrect  = isGuessed && currentWord.includes(letter)
    const isWrong    = isGuessed && !currentWord.includes(letter)
    return (
      <button
        key={letter}
        className={clsx({ correct: isCorrect, wrong: isWrong })}
        disabled={isGameOver}
        aria-disabled={isGuessed}
        aria-label={`Letter ${letter}`}
        onClick={() => addGuess(letter)}
      >
        {letter.toUpperCase()}
      </button>
    )
  })

  return (
    <div className="eg-root">
      <div className="eg-app">

        {/* header */}
        <header className="eg-header">
          <h1>Assembly: Endgame</h1>
          <p>Guess the word within 8 attempts to keep the programming world safe from Assembly!</p>
        </header>

        {/* status */}
        <section aria-live="polite" role="status" className={statusClass}>
          {renderStatus()}
        </section>

        {/* language chips */}
        <section className="eg-chips">{chipElements}</section>

        {/* word */}
        <section className="eg-word">{wordElements}</section>

        {/* screen reader live region */}
        <section className="eg-sr-only" aria-live="polite" role="status">
          <p>
            {currentWord.includes(lastGuessed)
              ? `Correct! ${lastGuessed} is in the word.`
              : `Sorry, ${lastGuessed} is not in the word.`}
            {' '}{numGuessesLeft - wrongGuessCount} attempts left.
          </p>
        </section>

        {/* keyboard */}
        <section className="eg-keyboard">{keyboardElements}</section>

        {/* new game */}
        {isGameOver && (
          <button className="eg-new-game" onClick={startNewGame}>
            New Game
          </button>
        )}

      </div>
    </div>
  )
}