from enum import Enum
from typing import List, Dict, Optional
from pydantic import BaseModel

class Level(str, Enum):
    COMPARISON = "comparison"
    SIMPLIFICATION = "simplification"
    ADDITION = "addition"
    SUBTRACTION = "subtraction"
    MULTIPLICATION = "multiplication"
    DIVISION = "division"

    @classmethod
    def get_next_level(cls, current_level: str) -> Optional[str]:
        levels = list(cls)
        try:
            current_index = levels.index(cls(current_level))
            if current_index + 1 < len(levels):
                return levels[current_index + 1].value
        except ValueError:
            pass
        return None

class LevelProgress(BaseModel):
    completed: bool = False
    score: int = 0
    attempts: int = 0
    last_attempt: Optional[str] = None

class UserProgress(BaseModel):
    user_id: str
    current_level: Level = Level.COMPARISON
    completed_levels: List[str] = []
    progress: Dict[str, LevelProgress] = {}

    def update_level_progress(self, level: str, score: int, completed: bool = False) -> None:
        if level not in self.progress:
            self.progress[level] = LevelProgress()
        
        level_progress = self.progress[level]
        level_progress.score = max(level_progress.score, score)
        level_progress.attempts += 1
        level_progress.completed = level_progress.completed or completed
        
        if completed and level not in self.completed_levels:
            self.completed_levels.append(level)
            next_level = Level.get_next_level(level)
            if next_level:
                self.current_level = Level(next_level) 