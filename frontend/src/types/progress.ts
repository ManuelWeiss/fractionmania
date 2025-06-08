export type Level = 
  | 'comparison'
  | 'simplification'
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division';

export interface LevelProgress {
  completed: boolean;
  score: number;
  attempts: number;
  last_attempt?: string;
}

export interface UserProgress {
  user_id: string;
  current_level: Level;
  completed_levels: Level[];
  progress: Record<Level, LevelProgress>;
}

export interface ProgressResponse {
  data: UserProgress;
  error?: string;
} 