import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { BaseExercise } from './BaseExercise';
import type { Level } from '../../types/progress';

interface Fraction {
  numerator: number;
  denominator: number;
}

type Answer = 'left' | 'right' | 'equal';

function generateFractions(): { left: Fraction; right: Fraction; answer: Answer } {
  const den1 = Math.floor(Math.random() * 11) + 2;
  const den2 = Math.floor(Math.random() * 11) + 2;
  const num1 = Math.floor(Math.random() * (den1 - 1)) + 1;
  const num2 = Math.floor(Math.random() * (den2 - 1)) + 1;
  const left = { numerator: num1, denominator: den1 };
  const right = { numerator: num2, denominator: den2 };
  const leftValue = num1 / den1;
  const rightValue = num2 / den2;
  let answer: Answer;
  if (Math.abs(leftValue - rightValue) < 0.0001) {
    answer = 'equal';
  } else {
    answer = leftValue > rightValue ? 'left' : 'right';
  }
  return { left, right, answer };
}

const TOTAL_QUESTIONS = 20;

export function ComparisonExercise() {
  const { levelId } = useParams<{ levelId: Level }>();
  const [current, setCurrent] = useState(0);
  const [questions, setQuestions] = useState(() => Array.from({ length: TOTAL_QUESTIONS }, generateFractions));
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; attempts: number }[]>([]);

  const handleAnswer = useCallback((answer: Answer) => {
    setSelectedAnswer(answer);
    const correct = answer === questions[current].answer;
    setIsCorrect(correct);
    setAttempts((prev) => prev + 1);
    if (correct) {
      // Score: 5 points for first try, 3 for second, 1 for third or more
      let earned = 0;
      if (attempts === 0) earned = 5;
      else if (attempts === 1) earned = 3;
      else earned = 1;
      setScore((s) => s + earned);
    }
  }, [questions, current, attempts]);

  const handleNext = useCallback(() => {
    setAnswers((arr) => [...arr, { correct: isCorrect === true, attempts: attempts + (isCorrect ? 0 : 1) }]);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setAttempts(0);
    setCurrent((c) => c + 1);
  }, [isCorrect, attempts]);

  const handleRestart = () => {
    setQuestions(Array.from({ length: TOTAL_QUESTIONS }, generateFractions));
    setCurrent(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setAttempts(0);
    setScore(0);
    setCompleted(false);
    setAnswers([]);
  };

  const handleComplete = async (finalScore: number) => {
    setCompleted(true);
    // Progress will be updated by BaseExercise
  };

  // When all questions are done, show summary and allow completion
  if (current >= TOTAL_QUESTIONS || completed) {
    const correctCount = answers.filter((a) => a.correct).length + (isCorrect ? 1 : 0);
    return (
      <BaseExercise
        level={levelId || 'comparison'}
        title="Compare Fractions"
        description="Choose which fraction is larger, or if they are equal"
        onComplete={handleComplete}
        maxScore={TOTAL_QUESTIONS * 5}
      >
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Session Complete!</h2>
          <p className="text-lg text-gray-700">You got {correctCount} out of {TOTAL_QUESTIONS} correct.</p>
          <p className="text-lg text-gray-700">Total Score: {score} / {TOTAL_QUESTIONS * 5}</p>
          <button
            onClick={handleRestart}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </BaseExercise>
    );
  }

  // Progress bar width
  const progressPercent = ((current) / TOTAL_QUESTIONS) * 100;
  const { left, right } = questions[current];

  return (
    <BaseExercise
      level={levelId || 'comparison'}
      title="Compare Fractions"
      description="Choose which fraction is larger, or if they are equal"
      onComplete={() => handleComplete(score)}
      maxScore={TOTAL_QUESTIONS * 5}
      currentScore={score}
    >
      <div className="space-y-8">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Problem {current + 1} of {TOTAL_QUESTIONS}</span>
            <span className="text-sm font-medium text-gray-700">Score: {score}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        {/* Fractions Display */}
        <div className="flex items-center justify-center space-x-8 text-4xl font-bold">
          <div className="text-center">
            <div className="border-b-2 border-gray-900 px-4">
              {left.numerator}
            </div>
            <div className="px-4">
              {left.denominator}
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => handleAnswer('left')}
              disabled={selectedAnswer !== null && (isCorrect ?? false)}
              className={`px-4 py-2 rounded-md ${
                selectedAnswer === 'left'
                  ? isCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              &gt;
            </button>
            <button
              onClick={() => handleAnswer('equal')}
              disabled={selectedAnswer !== null && (isCorrect ?? false)}
              className={`px-4 py-2 rounded-md ${
                selectedAnswer === 'equal'
                  ? isCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              =
            </button>
            <button
              onClick={() => handleAnswer('right')}
              disabled={selectedAnswer !== null && (isCorrect ?? false)}
              className={`px-4 py-2 rounded-md ${
                selectedAnswer === 'right'
                  ? isCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              &lt;
            </button>
          </div>
          <div className="text-center">
            <div className="border-b-2 border-gray-900 px-4">
              {right.numerator}
            </div>
            <div className="px-4">
              {right.denominator}
            </div>
          </div>
        </div>
        {/* Feedback and Next Button */}
        {selectedAnswer !== null && (
          <div className="text-center">
            {isCorrect ? (
              <div className="space-y-4">
                <p className="text-green-600 font-medium">Correct! Well done!</p>
                <button
                  onClick={handleNext}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  {current + 1 === TOTAL_QUESTIONS ? 'Finish' : 'Next Problem'}
                </button>
              </div>
            ) : (
              <p className="text-red-600 font-medium">
                Not quite. Try again!
              </p>
            )}
          </div>
        )}
      </div>
    </BaseExercise>
  );
} 