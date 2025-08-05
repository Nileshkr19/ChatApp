import React from 'react';


const strengthChecks  = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Contains number', test: (p) => /\d/.test(p) },
  { label: 'Contains special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export const PasswordStrengthMeter  = ({ password }) => {
  const passedChecks = strengthChecks.filter(check => check.test(password));
  const strength = passedChecks.length;
  
  const getStrengthColor = () => {
    if (strength < 2) return 'bg-red-500';
    if (strength < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Password strength:</span>
        <span className={`text-sm font-medium ${
          strength < 2 ? 'text-red-600' : 
          strength < 4 ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {getStrengthText()}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${(strength / strengthChecks.length) * 100}%` }}
        />
      </div>
      
      <div className="space-y-1">
        {strengthChecks.map((check, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              check.test(password) ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              {check.test(password) && (
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className={check.test(password) ? 'text-green-600' : 'text-gray-500'}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};