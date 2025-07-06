import { useState, useCallback } from 'react'
import { BaseExercise } from './BaseExercise'
import { lcm, simplify, generateTwoFractions } from './exerciseUtils'
import { FractionInput } from './FractionInput'
import React from 'react'

const TOTAL_QUESTIONS = 20

export function AdditionExercise() {
  const [current, setCurrent] = useState(0)
  const [questions, setQuestions] = useState(() =>
    Array.from({ length: TOTAL_QUESTIONS }, generateTwoFractions)
  )
  const [userNum, setUserNum] = useState('')
  const [userDen, setUserDen] = useState('')
  const [userWhole, setUserWhole] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([])

  const handleSubmit = useCallback(() => {
    const q = questions[current]
    const commonDen = lcm(q.den1, q.den2)
    const sumNum = q.num1 * (commonDen / q.den1) + q.num2 * (commonDen / q.den2)
    const { num: simplestNum, den: simplestDen } = simplify(sumNum, commonDen)
    const whole = parseInt(userWhole) || 0
    const num = parseInt(userNum) || 0
    const den = parseInt(userDen) || 1
    const improperNum = whole * den + num
    const correct = improperNum === simplestNum && den === simplestDen
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
    setQuestions(Array.from({ length: TOTAL_QUESTIONS }, generateTwoFractions))
    setCurrent(0)
    setUserNum('')
    setUserDen('')
    setUserWhole('')
    setIsCorrect(null)
    setScore(0)
    setCompleted(false)
    setAnswers([])
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

  if (current >= TOTAL_QUESTIONS || completed) {
    const correctCount = answers.filter((a) => a.correct).length + (isCorrect ? 1 : 0)
    return (
      <BaseExercise
        level="addition"
        title="Add Fractions"
        description="Add the two fractions and enter the answer in simplest form."
        onComplete={handleComplete}
        maxScore={TOTAL_QUESTIONS * 5}
        currentScore={score}
      >
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Session Complete!</h2>
          <p className="text-lg text-gray-700">
            You got {correctCount} out of {TOTAL_QUESTIONS} correct.
          </p>
          <p className="text-lg text-gray-700">
            Total Score: {score} / {TOTAL_QUESTIONS * 5}
          </p>
          <button
            onClick={handleRestart}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </BaseExercise>
    )
  }

  const q = questions[current]

  return (
    <BaseExercise
      level="addition"
      title="Add Fractions"
      description="Add the two fractions and enter the answer in simplest form."
      onComplete={() => handleComplete(score)}
      maxScore={TOTAL_QUESTIONS * 5}
      currentScore={score}
    >
      <div className="space-y-8">
        <div className="mb-4 flex items-center justify-center text-3xl font-bold space-x-4">
          {React.createElement(
            'math',
            { xmlns: 'http://www.w3.org/1998/Math/MathML', display: 'inline' },
            [
              React.createElement(
                'mfrac',
                { key: 'left' },
                React.createElement('mn', null, q.num1),
                React.createElement('mn', null, q.den1)
              ),
              React.createElement('mo', { key: 'plus' }, '+'),
              React.createElement(
                'mfrac',
                { key: 'right' },
                React.createElement('mn', null, q.num2),
                React.createElement('mn', null, q.den2)
              ),
            ]
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
