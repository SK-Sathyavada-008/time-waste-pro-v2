import { useState, useEffect, useRef } from 'react'
import './GhostEscape.css'

// ============================================================
// QUESTION BANK — 10 questions per language, 5 randomly picked
// ============================================================
const QUESTION_BANK = {
  Java: [
    { q: 'What keyword declares a class?', code: 'public _____ Animal {\n  String name;\n}', opts: ['class','define','object','struct'], ans: 'class' },
    { q: 'What is the output of this loop?', code: 'for(int i = 0; i < 3; i++) {\n  System.out.print(i);\n}', opts: ['123','012','321','Error'], ans: '012' },
    { q: 'What happens when a semicolon follows the for()?', code: 'for(int i = 0; i < 3; i++);\n{\n  System.out.println("Hello");\n}', opts: ['Prints Hello 3 times','Prints Hello once','Compilation Error','Infinite Loop'], ans: 'Prints Hello once' },
    { q: 'What class name is missing?', code: 'Scanner sc = new ______(System.in);', opts: ['Input','Reader','Scanner','Stream'], ans: 'Scanner' },
    { q: 'Which keyword makes a variable constant?', code: '_____ int MAX = 100;', opts: ['static','final','const','fixed'], ans: 'final' },
    { q: 'What is the output?', code: 'int x = 10;\nint y = 3;\nSystem.out.println(x % y);', opts: ['3','1','0','3.33'], ans: '1' },
    { q: 'What return type belongs in main()?', code: 'public static _____ main(String[] args) {}', opts: ['int','String','void','start'], ans: 'void' },
    { q: 'What does this print?', code: 'String s = "Hello";\nSystem.out.println(s.length());', opts: ['4','5','6','Error'], ans: '5' },
    { q: 'Which keyword is used to inherit a class?', code: 'class Dog _____ Animal {\n  // body\n}', opts: ['inherits','extends','implements','super'], ans: 'extends' },
    { q: 'What is the output?', code: 'boolean a = true;\nboolean b = false;\nSystem.out.println(a && b);', opts: ['true','false','null','Error'], ans: 'false' },
  ],
  Python: [
    { q: 'What is the output?', code: 'print(2 + 3)', opts: ['23','5','Error','None'], ans: '5' },
    { q: 'What keyword defines a function?', code: "_____ greet():\n    print('Hello')", opts: ['create','function','define','def'], ans: 'def' },
    { q: 'What is the output?', code: 'for i in range(3):\n    print(i)', opts: ['1 2 3','0 1 2','0 1 2 3','Error'], ans: '0 1 2' },
    { q: 'What does len() return here?', code: "name = 'Ghost'\nprint(len(name))", opts: ['4','5','6','Error'], ans: '5' },
    { q: 'Which keyword starts a conditional?', code: "x = 10\n_____ x > 5:\n    print('Big')", opts: ['when','if','check','while'], ans: 'if' },
    { q: 'What type does type() show?', code: 'x = 3.14\nprint(type(x))', opts: ['int','str','float','double'], ans: 'float' },
    { q: 'What is the output?', code: 'nums = [1, 2, 3]\nnums.append(4)\nprint(len(nums))', opts: ['3','4','5','Error'], ans: '4' },
    { q: 'Which symbol starts a Python comment?', code: '_____ This is a comment', opts: ['//','/*','#','--'], ans: '#' },
    { q: 'What is the output?', code: 'x = 7\nprint(x ** 2)', opts: ['14','49','72','Error'], ans: '49' },
    { q: 'What does this return?', code: "word = 'python'\nprint(word.upper())", opts: ['python','Python','PYTHON','Error'], ans: 'PYTHON' },
  ],
  JavaScript: [
    { q: 'Which keyword declares a block-scoped variable?', code: '_____ name = "Ghost";', opts: ['let','variable','int','define'], ans: 'let' },
    { q: 'What does typeof return?', code: 'console.log(typeof 5);', opts: ['integer','number','int','digit'], ans: 'number' },
    { q: 'What is the output?', code: 'let x = "5" + 5;\nconsole.log(x);', opts: ['10','55','NaN','Error'], ans: '55' },
    { q: 'Which method adds an item to an array?', code: 'let arr = [1, 2];\narr._______(3);', opts: ['add','push','insert','append'], ans: 'push' },
    { q: 'What does Boolean(0) return?', code: 'console.log(Boolean(0));', opts: ['true','false','0','undefined'], ans: 'false' },
    { q: 'Which keyword defines a named function?', code: '_____ greet() {\n  return "Hello";\n}', opts: ['def','func','function','method'], ans: 'function' },
    { q: 'What does .length return?', code: 'let a = [1, 2, 3];\nconsole.log(a.length);', opts: ['2','3','4','Error'], ans: '3' },
    { q: 'Which operator checks value AND type?', code: "console.log(5 ___ '5'); // false", opts: ['==','===','!=','=>'], ans: '===' },
    { q: 'What does typeof null return in JS?', code: 'let x = null;\nconsole.log(typeof x);', opts: ['null','undefined','object','Error'], ans: 'object' },
    { q: 'What is the output?', code: 'for(let i = 0; i < 3; i++) {\n  if(i === 1) break;\n  console.log(i);\n}', opts: ['0 1 2','0','1','0 1'], ans: '0' },
  ],
  React: [
    { q: 'Which hook creates a state variable?', code: 'const [count, setCount] = _______( 0 );', opts: ['useData','useState','useHook','state'], ans: 'useState' },
    { q: 'Which hook runs side effects after render?', code: "_______(() => {\n  document.title = 'Hi';\n}, []);", opts: ['useEffect','useRender','useState','useUpdate'], ans: 'useEffect' },
    { q: 'What method renders a list in JSX?', code: 'items._______(item => <li>{item}</li>)', opts: ['forEach','map','filter','reduce'], ans: 'map' },
    { q: 'How do you pass data into a child component?', code: "<MyComp message={value} />\n// 'message' is a _______", opts: ['state','hook','prop','ref'], ans: 'prop' },
    { q: 'How do you apply a CSS class in JSX?', code: '<div _______="container">Hello</div>', opts: ['class','className','classList','style'], ans: 'className' },
    { q: 'What causes a React component to re-render?', code: '// Changing _______ causes re-render', opts: ['a const variable','state or props','a let variable','a comment'], ans: 'state or props' },
    { q: 'How do you attach a click handler?', code: '<button _______={handleClick}>Click</button>', opts: ['onclick','onClick','onPress','click'], ans: 'onClick' },
    { q: 'What must every React component return?', code: 'function App() {\n  return _______;\n}', opts: ['a string always','JSX or null','an array only','undefined'], ans: 'JSX or null' },
    { q: 'Which hook reads a context value?', code: 'const val = _________(MyContext);', opts: ['useContext','useRef','useState','useStore'], ans: 'useContext' },
    { q: 'When does useEffect with [] dependency run?', code: 'useEffect(() => {\n  fetchData();\n}, []);', opts: ['Every render','Only once on mount','Every state change','Never'], ans: 'Only once on mount' },
  ],
}

// Shuffle and pick N items
function pickRandom(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n)
}

const WRONG_MSGS = [
  'Wrong! The ghost creeps closer...',
  'Bad answer. The ghost grins wickedly. 😈',
  'The ghost liked that mistake! 👻',
  "Incorrect! You can hear it breathing...",
  "Wrong! Its cold breath is on your neck...",
]

const OPT_LABELS = ['A', 'B', 'C', 'D']

// ── HALLWAY VISUAL ──────────────────────────────────────────
function Hallway({ ghostPos }) {
  const maxDashes = 20
  const dashes = '—'.repeat(Math.max(0, maxDashes - ghostPos * 4))
  const labels  = ["You're safe… for now.", 'The ghost stirs...', "It's getting closer! 😰", 'You can hear it!', "IT'S RIGHT BEHIND YOU! 😱", "IT'S GOT YOU!"]
  const cls     = ['safe-t', 'safe-t', 'warn-t', 'warn-t', 'danger-t', 'danger-t']
  const idx     = Math.min(ghostPos, 5)
  return (
    <div className="ge-hallway-wrap">
      <div className="ge-hallway">
        <span className="ge-player">🙂</span>
        <span className="ge-dashes">{dashes}</span>
        <span className={`ge-ghost ${ghostPos >= 3 ? 'ge-ghost-close' : ''}`}>👻</span>
      </div>
      <p className={`ge-hall-label ${cls[idx]}`}>{labels[idx]}</p>
    </div>
  )
}

// ── MAIN COMPONENT ───────────────────────────────────────────
export default function GhostEscape() {
  const [screen,   setScreen]   = useState('start')   // start | playing | win | lose
  const [lang,     setLang]     = useState(null)
  const [questions,setQuestions]= useState([])
  const [qIdx,     setQIdx]     = useState(0)
  const [lives,    setLives]    = useState(5)
  const [timer,    setTimer]    = useState(30)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)       // { type:'ok'|'no', msg }
  const [ghostPos, setGhostPos] = useState(0)
  const [correct,  setCorrect]  = useState(0)
  const [wrong,    setWrong]    = useState(0)
  const [loseReason,setLoseReason]=useState('')
  const [busy,     setBusy]     = useState(false)
  const timerRef = useRef(null)

  // ── TIMER ───────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setLoseReason('time')
          setScreen('lose')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [screen])

  // ── START ────────────────────────────────────────────────────
  function startGame(chosenLang) {
    clearInterval(timerRef.current)
    const qs = pickRandom(QUESTION_BANK[chosenLang], 5)
    setQuestions(qs); setLang(chosenLang); setQIdx(0)
    setLives(5); setTimer(30); setGhostPos(0)
    setCorrect(0); setWrong(0); setSelected(null)
    setFeedback(null); setBusy(false)
    setScreen('playing')
  }

  // ── SUBMIT ──────────────────────────────────────────────────
  function handleSubmit() {
    if (!selected || busy) return
    setBusy(true)
    const q  = questions[qIdx]
    const ok = selected === q.ans

    if (ok) {
      const newC = correct + 1
      setCorrect(newC)
      setFeedback({ type: 'ok', msg: '✅ Correct! You move ahead!' })
      setTimeout(() => {
        if (qIdx + 1 >= questions.length) { clearInterval(timerRef.current); setScreen('win') }
        else { setQIdx(i => i + 1); setSelected(null); setFeedback(null); setBusy(false) }
      }, 1000)
    } else {
      const newL = lives - 1
      const newG = ghostPos + 1
      const msg  = WRONG_MSGS[Math.floor(Math.random() * WRONG_MSGS.length)]
      setLives(newL); setGhostPos(newG)
      setWrong(w => w + 1)
      setFeedback({ type: 'no', msg })
      setTimeout(() => {
        if (newL <= 0) { clearInterval(timerRef.current); setLoseReason('lives'); setScreen('lose') }
        else if (qIdx + 1 >= questions.length) { clearInterval(timerRef.current); setScreen('win') }
        else { setQIdx(i => i + 1); setSelected(null); setFeedback(null); setBusy(false) }
      }, 1200)
    }
  }

  function goStart() { clearInterval(timerRef.current); setScreen('start'); setLang(null) }

  // ── RENDERS ─────────────────────────────────────────────────
  if (screen === 'start') return (
    <div className="ge-screen ge-start">
      <span className="ge-big-ghost">👻</span>
      <h1 className="ge-title">Ghost Escape</h1>
      <p className="ge-desc">
        A ghost is chasing you through a haunted corridor.<br />
        Answer <strong>5 random questions</strong> before the timer hits zero.<br />
        <em>10 questions per language — a different set every round!</em>
      </p>
      <p className="ge-lang-label">Pick your language:</p>
      <div className="ge-lang-row">
        {['Java','Python','JavaScript','React'].map(l => (
          <button key={l} className={`ge-lang-btn ${lang === l ? 'ge-lang-active' : ''}`} onClick={() => setLang(l)}>{l}</button>
        ))}
      </div>
      <button className="ge-start-btn" disabled={!lang} onClick={() => lang && startGame(lang)}>
        {lang ? `▶ Start — ${lang}` : 'Select a Language First'}
      </button>
    </div>
  )

  if (screen === 'playing') {
    const q       = questions[qIdx]
    const lowTime = timer <= 10
    return (
      <div className="ge-screen ge-playing">
        {/* HUD */}
        <div className="ge-hud">
          <span className={`ge-timer ${lowTime ? 'ge-timer-flash' : ''}`}>⏱ {timer}s</span>
          <span className="ge-hearts">
            {Array.from({length:5}).map((_,i) => (
              <span key={i} className={i < lives ? '' : 'ge-dead'}>{i < lives ? '❤️' : '🖤'}</span>
            ))}
          </span>
          <span className="ge-progress">Q {qIdx+1}/{questions.length} · <em>{lang}</em></span>
        </div>

        {/* Hallway */}
        <Hallway ghostPos={ghostPos} />

        {/* Question card */}
        <div className="ge-card">
          <p className="ge-q-text">{q.q}</p>
          {q.code && <pre className="ge-code"><code>{q.code}</code></pre>}

          <div className="ge-opts">
            {q.opts.map((opt, i) => {
              let cls = 'ge-opt'
              if (selected === opt)                              cls += ' ge-opt-sel'
              if (feedback && opt === q.ans)                    cls += ' ge-opt-correct'
              if (feedback && selected === opt && opt !== q.ans) cls += ' ge-opt-wrong'
              return (
                <button key={opt} className={cls} disabled={!!feedback}
                  onClick={() => !feedback && setSelected(opt)}>
                  <span className="ge-opt-lbl">{OPT_LABELS[i]}</span>
                  <span>{opt}</span>
                </button>
              )
            })}
          </div>

          {feedback && (
            <div className={`ge-feedback ${feedback.type === 'ok' ? 'ge-fb-ok' : 'ge-fb-no'}`}>
              {feedback.msg}
            </div>
          )}

          {!feedback && (
            <button className="ge-submit-btn" disabled={!selected || busy} onClick={handleSubmit}>
              {selected ? 'Submit Answer' : 'Select an option first'}
            </button>
          )}
        </div>
      </div>
    )
  }

  if (screen === 'win') return (
    <div className="ge-screen ge-result">
      <div className="ge-result-box">
        <span className="ge-result-icon ge-bounce">🎉</span>
        <h2 className="ge-result-title ge-win-title">You Escaped!</h2>
        <p className="ge-result-sub">The ghost couldn't catch you!</p>
        <div className="ge-stats">
          <div className="ge-stat-row"><span>Language</span><strong>{lang}</strong></div>
          <div className="ge-stat-row"><span>Correct</span><strong className="ge-green">✅ {correct}</strong></div>
          <div className="ge-stat-row"><span>Wrong</span><strong className="ge-red">❌ {wrong}</strong></div>
          <div className="ge-stat-row"><span>Time Left</span><strong>⏱ {timer}s</strong></div>
        </div>
        <div className="ge-result-btns">
          <button className="ge-primary-btn" onClick={() => startGame(lang)}>▶ Play Again</button>
          <button className="ge-secondary-btn" onClick={goStart}>Change Language</button>
        </div>
      </div>
    </div>
  )

  // Lose screen
  return (
    <div className="ge-screen ge-result">
      <div className="ge-result-box">
        <span className="ge-result-icon ge-shake">👻</span>
        <h2 className="ge-result-title ge-lose-title">The Ghost Got You!</h2>
        <p className="ge-result-sub">{loseReason === 'time' ? '⏱ You ran out of time!' : '💀 You lost all your lives!'}</p>
        <div className="ge-stats">
          <div className="ge-stat-row"><span>Correct</span><strong className="ge-green">✅ {correct}</strong></div>
          <div className="ge-stat-row"><span>Wrong</span><strong className="ge-red">❌ {wrong}</strong></div>
          <div className="ge-stat-row"><span>Reached</span><strong>Q{qIdx+1} / 5</strong></div>
        </div>
        <div className="ge-result-btns">
          <button className="ge-primary-btn" onClick={() => startGame(lang)}>↺ Try Again</button>
          <button className="ge-secondary-btn" onClick={goStart}>Change Language</button>
        </div>
      </div>
    </div>
  )
}
