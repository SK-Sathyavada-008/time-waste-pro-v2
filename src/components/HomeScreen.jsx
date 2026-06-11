// The landing page with the big button
function HomeScreen({ onPlay }) {
  return (
    <div className="home-screen">
      <h1 className="home-title">
        Time Waste
        <span>Pro 2.0</span>
      </h1>

      <p className="home-subtitle">
        You have nothing better to do. We both know it.
      </p>

      <button className="bored-button" onClick={onPlay}>
        I'm Bored
      </button>
    </div>
  )
}

export default HomeScreen