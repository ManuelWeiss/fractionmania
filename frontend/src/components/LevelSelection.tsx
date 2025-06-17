import { useNavigate } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';
import { LevelCard } from './LevelCard';
import type { Level } from '../types/progress';

const LEVEL_ORDER: Level[] = [
  'comparison',
  'simplification',
  'addition',
  'subtraction',
  'multiplication',
  'division'
];

export function LevelSelection() {
  const navigate = useNavigate();
  const { progress, isLoading, error } = useProgress();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading levels</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getLevelStatus = (level: Level) => {
    if (!progress) return { isLocked: false, isCompleted: false, score: undefined };
    
    const isCompleted = progress.completed_levels.includes(level);
    const levelProgress = progress.progress[level];
    
    return {
      isLocked: false,
      isCompleted,
      score: levelProgress?.score
    };
  };

  const handleLevelClick = (level: Level) => {
    navigate(`/level/${level}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Choose a Level</h2>
        <p className="mt-1 text-sm text-gray-500">
          Complete each level to unlock the next one. Your progress is saved automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEVEL_ORDER.map((level) => {
          const { isLocked, isCompleted, score } = getLevelStatus(level);
          return (
            <LevelCard
              key={level}
              level={level}
              isLocked={isLocked}
              isCompleted={isCompleted}
              score={score}
              onClick={() => handleLevelClick(level)}
            />
          );
        })}
      </div>
    </div>
  );
} 