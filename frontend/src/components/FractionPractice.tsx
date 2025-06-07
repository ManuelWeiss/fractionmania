import React, { useState } from 'react';
import FractionQuestion from './FractionQuestion';

type PracticeMode = 'Addition' | 'Subtraction' | 'Multiplication' | 'Division' | 'Comparison' | 'Conversion';

const FractionPractice: React.FC = () => {
  const [mode, setMode] = useState<PracticeMode | null>(null);

  const handleModeSelect = (selectedMode: PracticeMode) => {
    setMode(selectedMode);
  };

  const renderQuestion = () => {
    if (!mode) return null;
    return <FractionQuestion mode={mode} />;
  };

  return (
    <div>
      <h1>Fraction Practice</h1>
      <p>Select a practice mode:</p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {(['Addition', 'Subtraction', 'Multiplication', 'Division', 'Comparison', 'Conversion'] as PracticeMode[]).map((m) => (
          <button key={m} onClick={() => handleModeSelect(m)} style={{ padding: '5px 10px' }}>{m}</button>
        ))}
      </div>
      {renderQuestion()}
    </div>
  );
};

export default FractionPractice; 