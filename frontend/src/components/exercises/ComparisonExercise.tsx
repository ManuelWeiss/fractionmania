import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BaseExercise } from './BaseExercise';
import type { Level } from '../../types/progress';

interface Fraction {
  numerator: number;
  denominator: number;
}

type Answer = 'left' | 'right' | 'equal';

type Difficulty = 'easy' | 'advanced' | 'hard';

function parseMixedFraction(str: string) {
  // Handles "[whole ]numerator/denominator"
  const parts = str.trim().split(' ');
  let whole = 0, num = 0, den = 1;
  if (parts.length === 2) {
    whole = parseInt(parts[0], 10);
    [num, den] = parts[1].split('/').map(Number);
  } else {
    [num, den] = parts[0].split('/').map(Number);
  }
  // Convert to improper fraction
  const improperNum = Math.abs(whole) * den + num;
  return {
    numerator: whole < 0 ? -improperNum : improperNum,
    denominator: den,
    whole,
    num,
    den
  };
}

function parseComparisonLine(line: string) {
  // Format: [whole1 ]numerator1/denominator1, [whole2 ]numerator2/denominator2
  const [left, right] = line.split(',').map(s => s.trim());
  const leftFrac = parseMixedFraction(left);
  const rightFrac = parseMixedFraction(right);
  const leftValue = leftFrac.numerator / leftFrac.denominator;
  const rightValue = rightFrac.numerator / rightFrac.denominator;
  let answer: Answer;
  if (Math.abs(leftValue - rightValue) < 0.0001) {
    answer = 'equal';
  } else {
    answer = leftValue > rightValue ? 'left' : 'right';
  }
  return {
    left: leftFrac,
    right: rightFrac,
    answer
  };
}

const TOTAL_QUESTIONS = 20;
const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  advanced: 'Advanced',
  hard: 'Hard',
};

function renderMixedFraction({ whole, num, den }: { whole: number, num: number, den: number }) {
  return (
    <span className="inline-flex items-center">
      {whole !== 0 && <span className="mr-1">{whole}</span>}
      <span className="inline-flex flex-col items-center">
        <span className="border-b-2 border-gray-900 px-2">{num}</span>
        <span className="px-2">{den}</span>
      </span>
    </span>
  );
}

export function ComparisonExercise() {
  const { levelId } = useParams<{ levelId: Level }>();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [current, setCurrent] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; attempts: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);
        setError(null);
        const resp = await fetch(`/comparison-${difficulty}.txt`);
        if (!resp.ok) throw new Error('Failed to load questions');
        const text = await resp.text();
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        const parsed = lines.map(parseComparisonLine);
        setQuestions(parsed.slice(0, TOTAL_QUESTIONS));
      } catch (e: any) {
        setError(e.message || 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [difficulty]);

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
    setCurrent(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setAttempts(0);
    setScore(0);
    setCompleted(false);
    setAnswers([]);
    setStarted(false);
  };

  const handleComplete = async (finalScore: number) => {
    setCompleted(true);
    // Progress will be updated by BaseExercise
  };

  const handleSelectDifficulty = (diff: Difficulty) => {
    setDifficulty(diff);
    setCurrent(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setAttempts(0);
    setScore(0);
    setCompleted(false);
    setAnswers([]);
    setStarted(false);
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Select Difficulty</h2>
          <div className="flex space-x-4">
            {(['easy', 'advanced', 'hard'] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => { setDifficulty(diff); setStarted(true); }}
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
    );
  }

  if (loading) {
    return <div className="text-center py-12 text-lg">Loading questions...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (current >= questions.length || completed) {
    const correctCount = answers.filter((a) => a.correct).length + (isCorrect ? 1 : 0);
    return (
      <BaseExercise
        level={levelId || 'comparison'}
        title="Compare Fractions"
        description={`Choose which fraction is larger, or if they are equal. (Difficulty: ${DIFFICULTY_LABELS[difficulty]})`}
        onComplete={handleComplete}
        maxScore={TOTAL_QUESTIONS * 5}
      >
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Session Complete!</h2>
          <p className="text-lg text-gray-700">You got {correctCount} out of {questions.length} correct.</p>
          <p className="text-lg text-gray-700">Total Score: {score} / {questions.length * 5}</p>
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
    );
  }

  const { left, right } = questions[current];

  return (
    <BaseExercise
      level={levelId || 'comparison'}
      title="Compare Fractions"
      description={`Choose which fraction is larger, or if they are equal. (Difficulty: ${DIFFICULTY_LABELS[difficulty]})`}
      onComplete={() => handleComplete(score)}
      maxScore={TOTAL_QUESTIONS * 5}
      currentScore={score}
    >
      <div className="space-y-8">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Problem {current + 1} of {questions.length}</span>
            <span className="text-sm font-medium text-gray-700">Score: {score}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${((current) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        {/* Fractions Display */}
        <div className="flex items-center justify-center space-x-8 text-4xl font-bold">
          <div className="text-center">
            {renderMixedFraction(left)}
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
            {renderMixedFraction(right)}
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
                  {current + 1 === questions.length ? 'Finish' : 'Next Problem'}
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