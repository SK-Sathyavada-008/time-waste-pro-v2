import { useState } from 'react'
import './App.css'

import HomeScreen      from './components/HomeScreen'
import RandomButton    from './components/RandomButton'
import GameMenu        from './components/GameMenu'

import PolkaDots       from './games/PolkaDots/PolkaDots'
import DumbGame        from './games/DumbGame/DumbGame'
import RiggedRPS       from './games/RiggedRPS/RiggedRPS'
import CatBounce       from './games/CatBounce/CatBounce'
import Something       from './games/Something/Something'
import RainEffect      from './games/RainEffect/RainEffect'
import InfiniteCaptcha from './games/InfiniteCaptcha/InfiniteCaptcha'
import Fox             from './games/Fox/Fox'
import InterviewSim    from './games/InterviewSim/InterviewSim'
import EndlessKLH      from './games/EndlessKLH/EndlessKLH'
import Placeholder     from './games/Placeholder'
import Endgame from './games/Endgame/Endgame'
import Tenzies from './games/Tenzies/Tenzies'

const GAMES = [
  { id: 1,  name: 'Polka Dots',                component: <PolkaDots /> },
  { id: 2,  name: "World's Dumbest Game",       component: <DumbGame /> },
  { id: 3,  name: 'Rigged Rock Paper Scissors', component: <RiggedRPS /> },
  { id: 4,  name: 'Cat Bounce',                 component: <CatBounce /> },
  { id: 5,  name: 'Something',                  component: <Something /> },
  { id: 6,  name: 'Rain Effect',                component: <RainEffect /> },
  { id: 7,  name: 'Infinite CAPTCHA',           component: <InfiniteCaptcha /> },
  { id: 8,  name: 'Fox',                        component: <Fox /> },
  { id: 9,  name: 'Interview Simulator',        component: <InterviewSim /> },
  { id: 10, name: 'Endless KLH',                component: <EndlessKLH /> },
  { id: 11, name: 'Tenzies', component: <Tenzies /> },
  { id: 12, name: 'Endgame', component: <Endgame /> },
]

function getRandomIndex(currentIndex) {
  if (GAMES.length === 1) return 0
  let next
  do { next = Math.floor(Math.random() * GAMES.length) }
  while (next === currentIndex)
  return next
}

function App() {
  const [currentGame, setCurrentGame] = useState(null)

  function loadRandomGame()    { setCurrentGame(getRandomIndex(currentGame)) }
  function loadSpecificGame(i) { setCurrentGame(i) }

  if (currentGame === null) {
    return (
      <>
        <HomeScreen onPlay={loadRandomGame} />
        <GameMenu games={GAMES} currentGame={currentGame} onSelect={loadSpecificGame} />
      </>
    )
  }

  return (
    <div className="game-wrapper">
      <RandomButton onRandom={loadRandomGame} />
      <GameMenu games={GAMES} currentGame={currentGame} onSelect={loadSpecificGame} />
      {GAMES[currentGame].component}
    </div>
  )
}

export default App