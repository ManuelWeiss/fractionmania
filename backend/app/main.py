from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Dict

app = FastAPI(
    title="FractionMania API",
    description="Backend API for the FractionMania learning platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root() -> Dict[str, str]:
    return {"message": "Welcome to FractionMania API!"}

@app.get("/health")
async def health_check() -> JSONResponse:
    return JSONResponse(
        content={
            "status": "healthy",
            "version": "1.0.0"
        }
    )

# Import and include routers
# from app.api import exercises, users, auth
# app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
# app.include_router(users.router, prefix="/api/users", tags=["Users"])
# app.include_router(exercises.router, prefix="/api/exercises", tags=["Exercises"]) 