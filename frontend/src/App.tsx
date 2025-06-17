import { Routes, Route, Link } from 'react-router-dom';
import { ProgressProvider } from './contexts/ProgressContext';
import { LevelSelection } from './components/LevelSelection';
import { LevelRouter } from './components/LevelRouter';

function App() {
  return (
    <ProgressProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-3xl font-bold text-gray-900 hover:text-gray-700">
                FractionMania
              </Link>
              <nav>
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Levels
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<LevelSelection />} />
              <Route path="/level/:levelId" element={<LevelRouter />} />
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </div>
        </main>
      </div>
    </ProgressProvider>
  );
}

export default App;
