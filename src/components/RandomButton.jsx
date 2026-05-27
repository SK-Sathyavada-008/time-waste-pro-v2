// The small floating button on every game page
// When clicked it picks another random game and tells App.jsx
function RandomButton({ onRandom }) {
  return (
    <button className="random-btn" onClick={onRandom}>
      🎲 Still Bored?
    </button>
  )
}

export default RandomButton