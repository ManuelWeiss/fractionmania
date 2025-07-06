import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { progressApi } from '../services/api'
import type { UserProgress, Level } from '../types/progress'

interface ProgressContextType {
  progress: UserProgress | null
  currentLevel: Level
  isLoading: boolean
  error: string | null
  updateProgress: (level: Level, score: number, completed: boolean) => Promise<void>
  refreshProgress: () => Promise<void>
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

// Temporary user ID - in a real app, this would come from authentication
const TEMP_USER_ID = 'user-1'

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentLevel = progress?.current_level || 'comparison'

  const refreshProgress = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await progressApi.getUserProgress(TEMP_USER_ID)
      if (response.error) {
        setError(response.error)
      } else {
        setProgress(response.data)
      }
    } catch (err) {
      setError('Failed to load progress')
    } finally {
      setIsLoading(false)
    }
  }

  const updateProgress = async (level: Level, score: number, completed: boolean) => {
    try {
      setError(null)
      const response = await progressApi.updateLevelProgress(TEMP_USER_ID, level, score, completed)
      if (response.error) {
        setError(response.error)
      } else {
        setProgress(response.data)
      }
    } catch (err) {
      setError('Failed to update progress')
    }
  }

  useEffect(() => {
    refreshProgress()
  }, [])

  const value = {
    progress,
    currentLevel,
    isLoading,
    error,
    updateProgress,
    refreshProgress,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}
