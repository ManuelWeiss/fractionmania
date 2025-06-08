from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.models.progress import UserProgress, LevelProgress
from app.core.database import get_user_progress, update_user_progress

router = APIRouter()

@router.get("/{user_id}")
async def get_progress(user_id: str) -> Dict[str, Any]:
    """Get the current progress for a user"""
    try:
        progress = get_user_progress(user_id)
        return progress
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{user_id}/level/{level}")
async def update_level_progress(
    user_id: str,
    level: str,
    score: int,
    completed: bool = False
) -> Dict[str, Any]:
    """Update progress for a specific level"""
    try:
        # Get current progress
        progress_data = get_user_progress(user_id)
        user_progress = UserProgress(**progress_data)
        
        # Update progress
        user_progress.update_level_progress(level, score, completed)
        
        # Save to database
        updated_progress = update_user_progress(user_id, user_progress.dict())
        return updated_progress
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/current-level")
async def get_current_level(user_id: str) -> Dict[str, str]:
    """Get the current level for a user"""
    try:
        progress = get_user_progress(user_id)
        return {"current_level": progress["current_level"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 