import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProgress } from '../../contexts/ProgressContext';
import type { Level } from '../../types/progress';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface BaseExerciseProps {
  level: Level;
  title: string;
  description: string;
  onComplete: (score: number) => Promise<void>;
  children: React.ReactNode;
  maxScore?: number;
  currentScore?: number;
}

export function BaseExercise({ 
  level, 
  title, 
  description, 
  onComplete, 
  children,
  maxScore = 100,
  currentScore = 0
}: BaseExerciseProps) {
  const navigate = useNavigate();
  const { levelId } = useParams<{ levelId: string }>();
  const { progress, updateProgress } = useProgress();
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleComplete = async (earnedScore: number) => {
    try {
      setIsComplete(true);
      setFeedback({ type: 'success', message: 'Great job! Level completed!' });
      
      // Update progress
      await updateProgress(level, earnedScore, true);
      
      // Call the specific level's completion handler
      await onComplete(earnedScore);
    } catch (error) {
      setFeedback({ 
        type: 'error', 
        message: 'Failed to save progress. Please try again.' 
      });
    }
  };

  const handleError = (message: string) => {
    setFeedback({ type: 'error', message });
  };

  if (!progress) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Levels
        </button>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-lg text-gray-600">{description}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{currentScore}/{maxScore} points</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(currentScore / maxScore) * 100}%` }}
          />
        </div>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-md ${
            feedback.type === 'success' ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {feedback.type === 'success' ? (
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  feedback.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {feedback.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Content */}
      <div className="bg-white shadow rounded-lg p-6">
        {children}
      </div>

      {/* Level Navigation */}
      {isComplete && (
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Levels
          </button>
          {progress.current_level !== level && (
            <button
              onClick={() => navigate(`/level/${progress.current_level}`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Next Level
            </button>
          )}
        </div>
      )}
    </div>
  );
} 