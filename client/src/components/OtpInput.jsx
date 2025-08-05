import React, { useRef, useEffect } from 'react';


export const OtpInput = ({ 
  value, 
  onChange, 
  length = 6, 
  error 
}) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index, digit) => {
    if (digit.length > 1) digit = digit.slice(-1);
    if (!/^\d*$/.test(digit)) return;

    const newValue = value.split('');
    newValue[index] = digit;
    onChange(newValue.join(''));

    // Move to next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;
    
    onChange(pastedData.padEnd(length, ''));
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Enter 6-digit OTP
      </label>
      <div className="flex gap-3 justify-center">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`
              w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
              ${error ? 'border-red-500' : 'border-gray-300'}
              ${value[index] ? 'border-blue-500 bg-blue-50' : ''}
            `}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
};