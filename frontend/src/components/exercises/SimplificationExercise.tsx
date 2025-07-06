import { useState, useCallback, useEffect } from 'react'
import { BaseExercise } from './BaseExercise'
import { gcd, parseSimplificationLine, shuffleArray } from './exerciseUtils'
import { FractionInput } from './FractionInput'
import React from 'react'

const TOTAL_QUESTIONS = 20
type Difficulty = 'easy' | 'advanced' | 'hard'
const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  advanced: 'Advanced',
  hard: 'Hard',
}

export function SimplificationExercise() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [current, setCurrent] = useState(0)
  const [questions, setQuestions] = useState<any[]>([])
  const [userNum, setUserNum] = useState('')
  const [userDen, setUserDen] = useState('')
  const [userWhole, setUserWhole] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true)
        setError(null)
        const resp = await fetch(`/simplification-${difficulty}.txt`)
        if (!resp.ok) throw new Error('Failed to load questions')
        const text = await resp.text()
        const lines = text
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)

        // parse lines and shuffle them
        const parsed = lines.map(parseSimplificationLine)
        const shuffled = shuffleArray(parsed)

        // Add simplestNumerator and simplestDenominator for checking
        const withSimplest = shuffled.map((q) => {
          const divisor = gcd(q.numerator, q.denominator)
          return {
            ...q,
            simplestNumerator: q.numerator / divisor,
            simplestDenominator: q.denominator / divisor,
          }
        })
        setQuestions(withSimplest.slice(0, TOTAL_QUESTIONS))
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError('Failed to load questions')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [difficulty])

  const handleSubmit = useCallback(() => {
    const q = questions[current]
    const whole = parseInt(userWhole) || 0
    const num = parseInt(userNum) || 0
    const den = parseInt(userDen) || 1
    const improperNum = whole * den + num
    const correct = improperNum === q.simplestNumerator && den === q.simplestDenominator
    setIsCorrect(correct)
    if (correct) {
      setScore((s) => s + 5)
    }
  }, [userNum, userDen, userWhole, questions, current])

  const handleNext = () => {
    setAnswers((arr) => [...arr, { correct: isCorrect === true }])
    setUserNum('')
    setUserDen('')
    setUserWhole('')
    setIsCorrect(null)
    setCurrent((c) => c + 1)
  }

  const handleRestart = () => {
    setCurrent(0)
    setUserNum('')
    setUserDen('')
    setUserWhole('')
    setIsCorrect(null)
    setScore(0)
    setCompleted(false)
    setAnswers([])
    setStarted(false)
    setError(null)
    setLoading(true)
    // Refetch questions by resetting difficulty to itself
    setDifficulty((d) => d)
  }

  const handleComplete = async () => {
    setCompleted(true)
  }

  // Handlers to clear isCorrect on input change
  const handleNumChange = (val: string) => {
    setUserNum(val)
    if (isCorrect === false) setIsCorrect(null)
  }
  const handleDenChange = (val: string) => {
    setUserDen(val)
    if (isCorrect === false) setIsCorrect(null)
  }
  const handleWholeChange = (val: string) => {
    setUserWhole(val)
    if (isCorrect === false) setIsCorrect(null)
  }

  const handleSelectDifficulty = (diff: Difficulty) => {
    setDifficulty(diff)
    setCurrent(0)
    setUserNum('')
    setUserDen('')
    setUserWhole('')
    setIsCorrect(null)
    setScore(0)
    setCompleted(false)
    setAnswers([])
    setStarted(false)
    setError(null)
    setLoading(true)
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Select Difficulty</h2>
          <div className="flex space-x-4">
            {(['easy', 'advanced', 'hard'] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setDifficulty(diff)
                  setStarted(true)
                }}
                className={`px-6 py-2 rounded-lg font-semibold border-2 transition-colors duration-200 ${difficulty === diff ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'}`}
              >
                {DIFFICULTY_LABELS[diff]}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setStarted(true)}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || !!error}
        >
          Start Exercise
        </button>
        {loading && <div className="text-lg text-gray-600">Loading questions...</div>}
        {error && <div className="text-red-600">{error}</div>}
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-12 text-lg">Loading questions...</div>
  }
  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  if (current >= questions.length || completed) {
    const correctCount = answers.filter((a) => a.correct).length + (isCorrect ? 1 : 0)
    return (
      <BaseExercise
        level="simplification"
        title="Simplify Fractions"
        description={`Enter the simplest form of the given fraction. (Difficulty: ${DIFFICULTY_LABELS[difficulty]})`}
        onComplete={handleComplete}
        maxScore={TOTAL_QUESTIONS * 5}
        currentScore={score}
      >
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Session Complete!</h2>
          <p className="text-lg text-gray-700">
            You got {correctCount} out of {questions.length} correct.
          </p>
          <p className="text-lg text-gray-700">
            Total Score: {score} / {questions.length * 5}
          </p>
          <button
            onClick={handleRestart}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
          <div className="mt-6">
            <span className="mr-2 text-gray-700">Change difficulty:</span>
            {(['easy', 'advanced', 'hard'] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => handleSelectDifficulty(diff)}
                className={`px-4 py-1 rounded font-semibold border-2 mx-1 transition-colors duration-200 ${difficulty === diff ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'}`}
              >
                {DIFFICULTY_LABELS[diff]}
              </button>
            ))}
          </div>
        </div>
      </BaseExercise>
    )
  }

  const q = questions[current]

  return (
    <BaseExercise
      level="simplification"
      title="Simplify Fractions"
      description={`Enter the simplest form of the given fraction. (Difficulty: ${DIFFICULTY_LABELS[difficulty]})`}
      onComplete={handleComplete}
      maxScore={TOTAL_QUESTIONS * 5}
      currentScore={score}
    >
      <div className="space-y-8">
        <div className="mb-4 flex items-center justify-center text-3xl font-bold space-x-4">
          {React.createElement(
            'math',
            { xmlns: 'http://www.w3.org/1998/Math/MathML', display: 'inline' },
            React.createElement(
              'mfrac',
              null,
              React.createElement('mn', null, q.numerator),
              React.createElement('mn', null, q.denominator)
            )
          )}
          <span className="mx-2">=</span>
          <FractionInput
            numerator={userNum}
            denominator={userDen}
            onNumeratorChange={handleNumChange}
            onDenominatorChange={handleDenChange}
            wholeNumber={userWhole}
            onWholeNumberChange={handleWholeChange}
            showWholeNumber={true}
            disabled={isCorrect === true}
            className="ml-2"
          />
        </div>
        <div className="text-center mt-4">
          {isCorrect === null && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>
          )}
          {isCorrect === true && (
            <>
              <span className="text-green-600 font-medium mr-4">Correct!</span>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next
              </button>
            </>
          )}
          {isCorrect === false && (
            <span className="text-red-600 font-medium">Not quite. Try again!</span>
          )}
        </div>
      </div>
    </BaseExercise>
  )
}
