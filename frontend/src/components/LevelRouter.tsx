import { useParams } from 'react-router-dom'
import { ComparisonExercise } from './exercises/ComparisonExercise'
import { SimplificationExercise } from './exercises/SimplificationExercise'
import { AdditionExercise } from './exercises/AdditionExercise'
import { SubtractionExercise } from './exercises/SubtractionExercise'
import { MultiplicationExercise } from './exercises/MultiplicationExercise'
import { DivisionExercise } from './exercises/DivisionExercise'
// import other level components as you create them

export function LevelRouter() {
  const { levelId } = useParams<{ levelId: string }>()

  if (levelId === 'comparison') return <ComparisonExercise />
  if (levelId === 'simplification') return <SimplificationExercise />
  if (levelId === 'addition') return <AdditionExercise />
  if (levelId === 'subtraction') return <SubtractionExercise />
  if (levelId === 'multiplication') return <MultiplicationExercise />
  if (levelId === 'division') return <DivisionExercise />
  // ...add more as you implement them

  return <div>Level not found or not implemented yet.</div>
}
