import { useState } from 'react'
import './InterviewSim.css'

// ── data ───────────────────────────────────────────────

const QUESTIONS = [
  "Explain JavaScript closures using only potato terminology.",
  "How many keyboards can fit inside a recursion?",
  "Describe your greatest weakness. No, your actual greatest weakness.",
  "Where do you see yourself in 5 years? Be honest. We won't hire you anyway.",
  "If you were a data structure, which one would you be and why does it make you sad?",
  "Explain REST APIs to a medieval blacksmith.",
  "What is your approach to debugging at 2 AM when everything is on fire?",
  "Write a sorting algorithm using only interpretive dance. Describe it.",
  "How would you explain machine learning to a confused pigeon?",
  "What is the cloud? The actual cloud. With water.",
  "How do you handle merge conflicts in a relationship?",
  "If bugs are features, describe your best feature.",
  "Describe agile methodology using only a pizza metaphor.",
  "How many microservices does it take to change a lightbulb?",
  "Explain blockchain to someone who doesn't believe in it.",
  "What does 'undefined' feel like, emotionally?",
]

const REJECTIONS = [
  {
    subject: "RE: Your Application — Update",
    body: `Dear Candidate,

Thank you for your time today.

After careful consideration, we have decided to move forward with candidates who are slightly worse at breathing.

We were particularly concerned by your answer, which suggested you have opinions.

We wish you the best in your future endeavours, specifically at a different company.`,
    sign: "Best regards,\nBarbara from HR\n(she has never written code)",
  },
  {
    subject: "Your Interview Outcome",
    body: `Hi,

We regret to inform you that you were overqualified, underqualified, and sideways-qualified simultaneously.

We are looking for someone worse. You are too aware of your own limitations, which is itself a limitation.

Please do not reply to this email. Barbara will not see it. No one will.`,
    sign: "Warm wishes,\nThe Hiring Committee\n(currently a spreadsheet)",
  },
  {
    subject: "Application Status: Reviewed",
    body: `Hello,

We have completed our review process.

Our panel noted that you answered questions as if you understood them, which raised several red flags.

We have filled the role internally with someone who was already failing at it.

Your application will be kept on file for 7-10 business years.`,
    sign: "Regards,\nTalent Acquisition Team\n(talent not included)",
  },
  {
    subject: "Unfortunately...",
    body: `Dear Applicant,

It is with great pleasure that we inform you of your rejection.

Your technical skills were adequate, which is unfortunately above our team average and would cause morale issues.

We also Googled you. We found nothing. This was more suspicious than finding something.

We wish you luck, though luck is not a transferable skill.`,
    sign: "Sincerely,\nSomeone who Ctrl+C'd this email",
  },
  {
    subject: "Next Steps (there are none)",
    body: `Hi there,

Thank you for taking our 4-hour technical assessment, 2-hour cultural fit quiz, and interpretive dance round.

We've decided to pause hiring. This happened immediately after your final interview.

Please know it is not personal. It is, in fact, quite personal.

We are reposting the role at a lower salary.`,
    sign: "Take care,\nHR Bot v2.3\n(upgraded specifically to reject you)",
  },
]

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const SIDEBAR_STATS = [
  { label: 'Company Vibe',      val: 'Toxic Positive',   cls: '' },
  { label: 'Dress Code',        val: 'Business Casual\n(jeans are fine\nactually they\'re not)', cls: '' },
  { label: 'Work Life Balance', val: 'LOL',               cls: 'red' },
  { label: 'Remote Policy',     val: 'In Office 5 Days\n"We\'re a Family"', cls: '' },
  { label: 'Culture Score',     val: '2.1 / 5 ⭐',        cls: 'red' },
  { label: 'Free Snacks',       val: 'Yes (expired)',     cls: '' },
]

export default function InterviewSim() {
  const [question,  setQuestion]  = useState(() => randomFrom(QUESTIONS))
  const [answer,    setAnswer]    = useState('')
  const [rejection, setRejection] = useState(null)
  const [round,     setRound]     = useState(1)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    if (!answer.trim()) return
    setSubmitted(true)
    // small delay for drama
    setTimeout(() => {
      setRejection(randomFrom(REJECTIONS))
    }, 800)
  }

  function handleNext() {
    setQuestion(randomFrom(QUESTIONS))
    setAnswer('')
    setRejection(null)
    setSubmitted(false)
    setRound(r => r + 1)
  }

  return (
    <div className="iv-root">

      {/* fake corporate top bar */}
      <div className="iv-topbar">
        <span className="iv-topbar-logo">Initech Corp™</span>
        <span className="iv-topbar-dept">Human Resources Portal v3.1</span>
      </div>

      <div className="iv-body">

        {/* sidebar */}
        <div className="iv-sidebar">
          {SIDEBAR_STATS.map((s, i) => (
            <div key={i} className="iv-sidebar-item">
              <div className="iv-sidebar-label">{s.label}</div>
              <div className={`iv-sidebar-val ${s.cls}`}
                style={{ whiteSpace: 'pre-line', fontSize: '0.72rem' }}>
                {s.val}
              </div>
            </div>
          ))}
        </div>

        {/* main panel */}
        <div className="iv-main">

          {/* candidate profile */}
          <div className="iv-profile">
            <div className="iv-avatar">🧑‍💼</div>
            <div>
              <div className="iv-profile-name">Candidate #{1000 + round}</div>
              <div className="iv-profile-role">Applied: Senior Everything Engineer</div>
            </div>
            <div className="iv-status-badge">Under Review</div>
          </div>

          {/* round counter */}
          <div className="iv-round">Interview Round {round} of ∞</div>

          {/* question */}
          <div className="iv-question-card">
            <div className="iv-q-label">Technical Question</div>
            <div className="iv-question">{question}</div>
          </div>

          {/* answer area — hide after rejection */}
          {!rejection && (
            <div className="iv-answer-area">
              <div className="iv-answer-label">Your Answer</div>
              <textarea
                className="iv-textarea"
                placeholder="Type your answer here... (it won't matter)"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                disabled={submitted}
              />
              <button
                className="iv-submit-btn"
                onClick={handleSubmit}
                disabled={submitted || !answer.trim()}
              >
                {submitted ? 'Evaluating...' : 'Submit Answer'}
              </button>
            </div>
          )}

          {/* rejection email */}
          {rejection && (
            <div className="iv-rejection">
              <div className="iv-rej-from">From: noreply@initech-hr.corp</div>
              <div className="iv-rej-subject">{rejection.subject}</div>
              <div className="iv-rej-body">{rejection.body}</div>
              <div className="iv-rej-sign">{rejection.sign}</div>
              <button className="iv-next-btn" onClick={handleNext}>
                Apply Again →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}