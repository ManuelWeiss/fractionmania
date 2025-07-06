import React from 'react'
import './FractionInput.css'

interface FractionInputProps {
  numerator: string
  denominator: string
  onNumeratorChange: (value: string) => void
  onDenominatorChange: (value: string) => void
  disabled?: boolean
  className?: string
  wholeNumber?: string
  onWholeNumberChange?: (value: string) => void
  showWholeNumber?: boolean
}

export function FractionInput({
  numerator,
  denominator,
  onNumeratorChange,
  onDenominatorChange,
  disabled = false,
  className = '',
  wholeNumber = '',
  onWholeNumberChange,
  showWholeNumber = false,
}: FractionInputProps) {
  return (
    <span
      className={`fraction-input-root inline-flex items-center text-2xl font-bold ${className} ${showWholeNumber ? 'fraction-input-mixed' : ''}`}
    >
      {showWholeNumber && (
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={wholeNumber}
          onChange={(e) => onWholeNumberChange?.(e.target.value)}
          className="fraction-input-whole w-10 text-center border-none focus:ring-0 bg-transparent hide-arrows mr-1"
          placeholder=""
          disabled={disabled}
          autoComplete="off"
        />
      )}
      <span className="fraction-input-fraction inline-flex flex-col items-center">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={numerator}
          onChange={(e) => onNumeratorChange(e.target.value)}
          className="fraction-input-num w-full text-center border-none border-b-2 border-gray-900 focus:ring-0 focus:border-blue-500 bg-transparent hide-arrows"
          placeholder=""
          disabled={disabled}
          autoComplete="off"
        />
        <div className="fraction-input-bar w-full border-b-2 border-gray-900 my-1" />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={denominator}
          onChange={(e) => onDenominatorChange(e.target.value)}
          className="fraction-input-den w-full text-center border-none focus:ring-0 bg-transparent hide-arrows"
          placeholder=""
          disabled={disabled}
          autoComplete="off"
        />
      </span>
      {/* Hide number input arrows for all browsers */}
      <style>{`
        input[type='number'], input[type='text']::-webkit-outer-spin-button, input[type='text']::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'], input[type='text'] {
          -moz-appearance: textfield;
        }
      `}</style>
    </span>
  )
}
