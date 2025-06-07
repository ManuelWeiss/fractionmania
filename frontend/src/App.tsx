import React from 'react'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import FractionPractice from './components/FractionPractice'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>FractionMania</h1>
      </header>
      <FractionPractice />
    </div>
  )
}

export default App
