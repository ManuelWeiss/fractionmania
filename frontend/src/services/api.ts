import axios, { AxiosError } from 'axios'
import type { UserProgress, Level, ProgressResponse } from '../types/progress'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const createEmptyProgress = (userId: string): UserProgress => ({
  user_id: userId,
  current_level: 'comparison',
  completed_levels: [],
  progress: {
    comparison: { completed: false, score: 0, attempts: 0 },
    simplification: { completed: false, score: 0, attempts: 0 },
    addition: { completed: false, score: 0, attempts: 0 },
    subtraction: { completed: false, score: 0, attempts: 0 },
    multiplication: { completed: false, score: 0, attempts: 0 },
    division: { completed: false, score: 0, attempts: 0 },
  },
})

export const progressApi = {
  // Get user's overall progress
  async getUserProgress(userId: string): Promise<ProgressResponse> {
    try {
      const response = await api.get<UserProgress>(`/progress/${userId}`)
      return { data: response.data }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        return {
          data: createEmptyProgress(userId),
          error: err.response?.data?.detail || 'Failed to fetch progress',
        }
      }
      throw err
    }
  },

  // Update progress for a specific level
  async updateLevelProgress(
    userId: string,
    level: Level,
    score: number,
    completed: boolean = false
  ): Promise<ProgressResponse> {
    try {
      const response = await api.post<UserProgress>(`/progress/${userId}/level/${level}`, {
        score,
        completed,
      })
      return { data: response.data }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        return {
          data: createEmptyProgress(userId),
          error: err.response?.data?.detail || 'Failed to update progress',
        }
      }
      throw err
    }
  },

  // Get user's current level
  async getCurrentLevel(userId: string): Promise<{ current_level: Level; error?: string }> {
    try {
      const response = await api.get<{ current_level: Level }>(`/progress/${userId}/current-level`)
      return { current_level: response.data.current_level }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        return {
          current_level: 'comparison',
          error: err.response?.data?.detail || 'Failed to fetch current level',
        }
      }
      throw err
    }
  },
}
