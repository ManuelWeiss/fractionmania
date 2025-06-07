import * as React from 'react';
import { useState, useEffect } from 'react';

type FractionQuestionProps = {
  mode: 'Addition' | 'Subtraction' | 'Multiplication' | 'Division' | 'Comparison' | 'Conversion';
};

type Fraction = { num: number; den: number };

// Helper to render a fraction as MathML using React.createElement
const renderFractionMathML = (num: number, den: number) => (
  React.createElement('math', { xmlns: 'http://www.w3.org/1998/Math/MathML', display: 'inline' },
    React.createElement('mfrac', null,
      React.createElement('mn', null, num),
      React.createElement('mn', null, den)
    )
  )
);

// Helper to render a mixed number as MathML
const renderMixedNumberMathML = (whole: number, num: number, den: number) => (
  <span>
    <span style={{ marginRight: 4 }}>{whole}</span>
    {renderFractionMathML(num, den)}
  </span>
);

// Helper to convert improper fraction to mixed number
const improperToMixed = (f: Fraction) => {
  const whole = Math.trunc(f.num / f.den);
  const remainder = Math.abs(f.num % f.den);
  return { whole, num: remainder, den: f.den };
};

// Helper to check if a fraction is simplified
const isSimplified = (f: Fraction) => {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  return Math.abs(gcd(f.num, f.den)) === 1;
};

// Helper to render a question as MathML using React.createElement
const renderQuestionMathML = (mode: string, f1: Fraction, f2?: Fraction, denTarget?: number, symbol?: string) => {
  switch (mode) {
    case 'Addition':
      return (
        <span>
          {renderFractionMathML(f1.num, f1.den)}
          {React.createElement('mo', null, '+')}
          {f2 && renderFractionMathML(f2.num, f2.den)}
        </span>
      );
    case 'Subtraction':
      return (
        <span>
          {renderFractionMathML(f1.num, f1.den)}
          {React.createElement('mo', null, '-')}
          {f2 && renderFractionMathML(f2.num, f2.den)}
        </span>
      );
    case 'Multiplication':
      return (
        <span>
          {renderFractionMathML(f1.num, f1.den)}
          {React.createElement('mo', null, '×')}
          {f2 && renderFractionMathML(f2.num, f2.den)}
        </span>
      );
    case 'Division':
      return (
        <span>
          {renderFractionMathML(f1.num, f1.den)}
          {React.createElement('mo', null, '÷')}
          {f2 && renderFractionMathML(f2.num, f2.den)}
        </span>
      );
    case 'Comparison':
      return (
        <span>
          Compare: {renderFractionMathML(f1.num, f1.den)}
          {React.createElement('mo', null, symbol)}
          {f2 && renderFractionMathML(f2.num, f2.den)}
        </span>
      );
    case 'Conversion':
      return (
        <span>
          Convert {renderFractionMathML(f1.num, f1.den)} to a fraction with denominator {denTarget}
        </span>
      );
    default:
      return null;
  }
};

// Confetti burst component
const Confetti: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;
  // Simple emoji confetti burst
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, height: '100%',
      pointerEvents: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      zIndex: 10,
      fontSize: '2.5em',
      animation: 'confetti-fall 1s ease',
    }}>
      <span role="img" aria-label="confetti">🎉 🎊 🥳 🎉 🎊</span>
      <style>{`
        @keyframes confetti-fall {
          0% { opacity: 0; transform: translateY(-40px) scale(0.7); }
          40% { opacity: 1; transform: translateY(10px) scale(1.1); }
          100% { opacity: 0; transform: translateY(80px) scale(0.9); }
        }
      `}</style>
    </div>
  );
};

const FractionQuestion: React.FC<FractionQuestionProps> = ({ mode }) => {
  const [question, setQuestion] = useState<React.ReactElement | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<Fraction | null>(null);
  const [correctAnswerRaw, setCorrectAnswerRaw] = useState<Fraction | null>(null); // for hint
  const [numerator, setNumerator] = useState<string>("");
  const [denominator, setDenominator] = useState<string>("");
  const [whole, setWhole] = useState<string>(""); // for mixed number input
  const [useMixed, setUseMixed] = useState<boolean>(false); // toggle for mixed number input
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackMathML, setFeedbackMathML] = useState<React.ReactElement | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const generateRandomFraction = (maxDen: number = 10): Fraction => {
    const den = Math.floor(Math.random() * (maxDen - 1)) + 1;
    const num = Math.floor(Math.random() * den) + 1;
    return { num, den };
  };

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  const simplifyFraction = (f: Fraction): Fraction => {
    const divisor = gcd(f.num, f.den);
    return { num: f.num / divisor, den: f.den / divisor };
  };

  const generateRandomDenominator = (f: Fraction, maxDen: number = 20): number => {
    const k = Math.floor(Math.random() * (maxDen / f.den)) + 1;
    return f.den * k;
  };

  const generateQuestion = () => {
    let f1 = generateRandomFraction();
    let f2 = generateRandomFraction();
    let denTarget: number | undefined = undefined;
    let symbol: string | undefined = undefined;
    let rawAnswer: Fraction = { num: 0, den: 1 };
    let simplified: Fraction = { num: 0, den: 1 };
    if (mode === 'Addition') {
      const lcm = (f1.den * f2.den) / gcd(f1.den, f2.den);
      const num1 = f1.num * (lcm / f1.den);
      const num2 = f2.num * (lcm / f2.den);
      const sumNum = num1 + num2;
      const sumDen = lcm;
      rawAnswer = { num: sumNum, den: sumDen };
      simplified = simplifyFraction(rawAnswer);
      setQuestion(renderQuestionMathML(mode, f1, f2));
      setCorrectAnswer(simplified);
      setCorrectAnswerRaw(rawAnswer);
    } else if (mode === 'Subtraction') {
      const lcm = (f1.den * f2.den) / gcd(f1.den, f2.den);
      const num1 = f1.num * (lcm / f1.den);
      const num2 = f2.num * (lcm / f2.den);
      const diffNum = num1 - num2;
      const diffDen = lcm;
      rawAnswer = { num: diffNum, den: diffDen };
      simplified = simplifyFraction(rawAnswer);
      setQuestion(renderQuestionMathML(mode, f1, f2));
      setCorrectAnswer(simplified);
      setCorrectAnswerRaw(rawAnswer);
    } else if (mode === 'Multiplication') {
      const prodNum = f1.num * f2.num;
      const prodDen = f1.den * f2.den;
      rawAnswer = { num: prodNum, den: prodDen };
      simplified = simplifyFraction(rawAnswer);
      setQuestion(renderQuestionMathML(mode, f1, f2));
      setCorrectAnswer(simplified);
      setCorrectAnswerRaw(rawAnswer);
    } else if (mode === 'Division') {
      const divNum = f1.num * f2.den;
      const divDen = f1.den * f2.num;
      rawAnswer = { num: divNum, den: divDen };
      simplified = simplifyFraction(rawAnswer);
      setQuestion(renderQuestionMathML(mode, f1, f2));
      setCorrectAnswer(simplified);
      setCorrectAnswerRaw(rawAnswer);
    } else if (mode === 'Comparison') {
      const lcm = (f1.den * f2.den) / gcd(f1.den, f2.den);
      const num1 = f1.num * (lcm / f1.den);
      const num2 = f2.num * (lcm / f2.den);
      const isGreater = num1 > num2;
      symbol = isGreater ? '>' : '<';
      setQuestion(renderQuestionMathML(mode, f1, f2, undefined, symbol));
      setCorrectAnswer({ num: isGreater ? 1 : 0, den: 1 });
      setCorrectAnswerRaw({ num: isGreater ? 1 : 0, den: 1 });
    } else if (mode === 'Conversion') {
      denTarget = generateRandomDenominator(f1);
      const convNum = f1.num * (denTarget / f1.den);
      const convDen = denTarget;
      rawAnswer = { num: convNum, den: convDen };
      simplified = simplifyFraction(rawAnswer);
      setQuestion(renderQuestionMathML(mode, f1, undefined, denTarget));
      setCorrectAnswer(simplified);
      setCorrectAnswerRaw(rawAnswer);
    } else {
      setQuestion(null);
      setCorrectAnswer({ num: 0, den: 1 });
      setCorrectAnswerRaw({ num: 0, den: 1 });
    }
    setFeedback(null);
    setFeedbackMathML(null);
    setNumerator("");
    setDenominator("");
    setWhole("");
    setUseMixed(false);
    // Hint if the correct answer can be simplified
    if (rawAnswer.num !== simplified.num || rawAnswer.den !== simplified.den) {
      setHint('Hint: The answer can be simplified!');
    } else {
      setHint(null);
    }
  };

  useEffect(() => {
    generateQuestion();
    // eslint-disable-next-line
  }, [mode]);

  const handleSubmit = () => {
    if (!correctAnswer) return;
    let userNum: number, userDen: number;
    if (useMixed) {
      // Mixed number input: convert to improper fraction
      const w = parseInt(whole, 10) || 0;
      const n = parseInt(numerator, 10);
      const d = parseInt(denominator, 10);
      if (isNaN(n) || isNaN(d) || d === 0) {
        setFeedback("Please enter a valid mixed number.");
        setFeedbackMathML(null);
        setHint(null);
        return;
      }
      userNum = Math.abs(w) * d + n;
      if (w < 0) userNum = -userNum; // handle negative whole part
      userDen = d;
    } else {
      userNum = parseInt(numerator, 10);
      userDen = parseInt(denominator, 10);
      if (isNaN(userNum) || isNaN(userDen) || userDen === 0) {
        setFeedback("Please enter a valid fraction.");
        setFeedbackMathML(null);
        setHint(null);
        return;
      }
    }
    const userFraction = { num: userNum, den: userDen };
    const userSimplified = simplifyFraction(userFraction);
    let hintMsg = null;
    if (
      userSimplified.num === correctAnswer.num &&
      userSimplified.den === correctAnswer.den &&
      (userSimplified.num !== userFraction.num || userSimplified.den !== userFraction.den)
    ) {
      hintMsg = 'Hint: Your answer is correct, but it can be simplified!';
    }
    setHint(hintMsg);
    if (userSimplified.num === correctAnswer.num && userSimplified.den === correctAnswer.den) {
      setFeedback("Correct! The answer is:");
      setFeedbackMathML(
        <span style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#1a8917', display: 'block', margin: '0.5em 0', fontFamily: 'Quicksand, Arial, sans-serif', transition: 'all 0.4s', animation: 'fadeScaleIn 0.5s' }}>
          {renderFractionMathML(correctAnswer.num, correctAnswer.den)}
          {Math.abs(correctAnswer.num) >= correctAnswer.den && (
            <span style={{ marginLeft: 16, fontSize: '0.7em', color: '#333' }}>
              (Mixed: {(() => {
                const { whole, num, den } = improperToMixed(correctAnswer);
                return num === 0
                  ? whole
                  : renderMixedNumberMathML(whole, num, den);
              })()})
            </span>
          )}
        </span>
      );
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1200);
    } else {
      setFeedback(`Incorrect. The correct answer is:`);
      setFeedbackMathML(
        <span style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#b91c1c', display: 'block', margin: '0.5em 0', fontFamily: 'Quicksand, Arial, sans-serif', transition: 'all 0.4s', animation: 'fadeScaleIn 0.5s' }}>
          {renderFractionMathML(correctAnswer.num, correctAnswer.den)}
          {Math.abs(correctAnswer.num) >= correctAnswer.den && (
            <span style={{ marginLeft: 16, fontSize: '0.7em', color: '#333' }}>
              (Mixed: {(() => {
                const { whole, num, den } = improperToMixed(correctAnswer);
                return num === 0
                  ? whole
                  : renderMixedNumberMathML(whole, num, den);
              })()})
            </span>
          )}
        </span>
      );
      setShowConfetti(false);
    }
  };

  const handleNext = () => {
    setWhole("");
    setNumerator("");
    setDenominator("");
    generateQuestion();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Quicksand, Arial, sans-serif' }}>
      <Confetti show={showConfetti} />
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 24,
        boxShadow: '0 4px 32px 0 rgba(80,80,180,0.10)',
        padding: '2.5em 2em 2em 2em',
        maxWidth: 420,
        width: '100%',
        margin: '2em 0',
        position: 'relative',
        border: '2px solid #e0e7ff',
      }}>
        <h2 style={{ textAlign: 'center', fontWeight: 700, color: '#6366f1', letterSpacing: 1 }}>Practicing {mode} Fractions</h2>
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <label style={{ fontWeight: 500 }}>
            <input
              type="checkbox"
              checked={useMixed}
              onChange={e => setUseMixed(e.target.checked)}
              style={{ marginRight: 6 }}
            />
            Input as mixed number
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.5em', marginBottom: 18, justifyContent: 'center' }}>
          <span>{question}</span>
          <span style={{ margin: '0 12px' }}>=</span>
          {useMixed ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9-]*"
                value={whole}
                onChange={e => setWhole(e.target.value.replace(/[^0-9-]/g, ''))}
                placeholder="W"
                style={{ width: 32, marginRight: 4, fontSize: '1em', textAlign: 'center', border: '1.5px solid #a5b4fc', borderRadius: 6, outline: 'none', transition: 'border 0.2s' }}
              />
              <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={numerator}
                    onChange={e => setNumerator(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="N"
                    style={{ width: 32, fontSize: '1em', textAlign: 'center', borderBottom: 'none', borderRadius: 0, border: '1.5px solid #a5b4fc', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, outline: 'none', transition: 'border 0.2s' }}
                  />
                  <div style={{ width: 32, height: 2, background: '#6366f1', margin: '2px 0' }} />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={denominator}
                    onChange={e => setDenominator(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="D"
                    style={{ width: 32, fontSize: '1em', textAlign: 'center', borderTop: 'none', borderRadius: 0, border: '1.5px solid #a5b4fc', borderTopLeftRadius: 0, borderTopRightRadius: 0, outline: 'none', transition: 'border 0.2s' }}
                  />
                </div>
              </span>
            </div>
          ) : (
            <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9-]*"
                  value={numerator}
                  onChange={e => setNumerator(e.target.value.replace(/[^0-9-]/g, ''))}
                  placeholder="N"
                  style={{ width: 32, fontSize: '1em', textAlign: 'center', borderBottom: 'none', borderRadius: 0, border: '1.5px solid #a5b4fc', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, outline: 'none', transition: 'border 0.2s' }}
                />
                <div style={{ width: 32, height: 2, background: '#6366f1', margin: '2px 0' }} />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={denominator}
                  onChange={e => setDenominator(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="D"
                  style={{ width: 32, fontSize: '1em', textAlign: 'center', borderTop: 'none', borderRadius: 0, border: '1.5px solid #a5b4fc', borderTopLeftRadius: 0, borderTopRightRadius: 0, outline: 'none', transition: 'border 0.2s' }}
                />
              </div>
            </span>
          )}
        </div>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <button
            onClick={handleSubmit}
            style={{
              background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '0.6em 1.5em',
              fontWeight: 700,
              fontSize: '1.1em',
              cursor: 'pointer',
              boxShadow: '0 2px 8px 0 rgba(99,102,241,0.08)',
              transition: 'background 0.2s, transform 0.1s',
              marginRight: 8,
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Submit
          </button>
        </div>
        {feedback && (
          <div style={{ marginTop: '1em', textAlign: 'center', minHeight: 80 }}>
            <p style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: 0 }}>{feedback}</p>
            {feedbackMathML}
            {hint && <div style={{ color: 'orange', marginTop: 8, fontSize: '1.1em' }}>{hint}</div>}
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleNext}
            style={{
              background: 'linear-gradient(90deg, #fbbf24 0%, #f472b6 100%)',
              color: '#22223b',
              border: 'none',
              borderRadius: 8,
              padding: '0.6em 1.5em',
              fontWeight: 700,
              fontSize: '1.1em',
              cursor: 'pointer',
              boxShadow: '0 2px 8px 0 rgba(251,191,36,0.08)',
              transition: 'background 0.2s, transform 0.1s',
              marginTop: 8,
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Next Question
          </button>
        </div>
        <style>{`
          @keyframes fadeScaleIn {
            0% { opacity: 0; transform: scale(0.7); }
            60% { opacity: 1; transform: scale(1.08); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default FractionQuestion; 