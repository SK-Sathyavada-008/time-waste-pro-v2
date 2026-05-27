export default function Die({ value, isHeld, hold }) {
  return (
    <button
      className={`tz-die ${isHeld ? 'held' : ''}`}
      onClick={hold}
      aria-pressed={isHeld}
      aria-label={`Die with value ${value}, ${isHeld ? 'held' : 'not held'}`}
    >
      {value}
    </button>
  )
}