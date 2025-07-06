import { LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import type { Level } from '../types/progress'

interface LevelCardProps {
  level: Level
  isLocked: boolean
  isCompleted: boolean
  score?: number
  onClick: () => void
}

const levelTitles: Record<Level, string> = {
  comparison: 'Compare Fractions',
  simplification: 'Simplify Fractions',
  addition: 'Add Fractions',
  subtraction: 'Subtract Fractions',
  multiplication: 'Multiply Fractions',
  division: 'Divide Fractions',
}

const levelDescriptions: Record<Level, string> = {
  comparison: 'Learn to compare fractions using <, >, and =',
  simplification: 'Learn to simplify fractions to their lowest terms',
  addition: 'Learn to add fractions with like and unlike denominators',
  subtraction: 'Learn to subtract fractions with like and unlike denominators',
  multiplication: 'Learn to multiply fractions and mixed numbers',
  division: 'Learn to divide fractions and mixed numbers',
}

export function LevelCard({ level, isLocked, isCompleted, score, onClick }: LevelCardProps) {
  const title = levelTitles[level]
  const description = levelDescriptions[level]

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`
        relative w-full p-6 rounded-lg text-left transition-all
        ${
          isLocked
            ? 'bg-gray-100 cursor-not-allowed'
            : 'bg-white hover:bg-gray-50 shadow-sm hover:shadow-md'
        }
        ${isCompleted ? 'border-2 border-green-500' : 'border border-gray-200'}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
          {score !== undefined && !isLocked && (
            <p className="mt-2 text-sm font-medium text-gray-700">Best Score: {score}</p>
          )}
        </div>
        <div className="ml-4">
          {isLocked ? (
            <LockClosedIcon className="h-6 w-6 text-gray-400" />
          ) : isCompleted ? (
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
          ) : null}
        </div>
      </div>
    </button>
  )
}
