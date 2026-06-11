// Hidden game selector menu
// The toggle button is barely visible — small, low contrast
// Click it to open a panel listing all 12 games

function GameMenu({ games, currentGame, onSelect }) {
  const [open, setOpen] = useState(false)

  function handleSelect(index) {
    setOpen(false)
    onSelect(index)
  }

  return (
    <>
      {/* the barely-visible toggle button */}
      <button
        className="menu-toggle"
        onClick={() => setOpen(prev => !prev)}
        title="Games list"
      >
        -
      </button>

      {/* backdrop — click outside to close */}
      {open && (
        <div
          className="game-menu-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* the dropdown panel */}
      {open && (
        <div className="game-menu">
          <div className="game-menu-header">all games</div>
          <div className="game-menu-list">
            {games.map((game, index) => (
              <button
                key={game.id}
                className={`game-menu-item ${currentGame === index ? 'active' : ''}`}
                onClick={() => handleSelect(index)}
              >
                <span className="game-num">{String(index + 1).padStart(2, '0')}</span>
                <span className="game-name">{game.name}</span>
                {currentGame === index && <span className="active-dot" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

// need useState inside this component
import { useState } from 'react'

export default GameMenu