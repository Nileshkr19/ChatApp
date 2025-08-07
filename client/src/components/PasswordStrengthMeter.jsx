import React from 'react';
import { Check, X } from 'lucide-react';

// The rules for a strong password
const passwordCriteria = [
  { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
  { label: 'Contains an uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
  { label: 'Contains a lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
  { label: 'Contains a number', test: (pwd) => /\d/.test(pwd) },
  { label: 'Contains a special character', test: (pwd) => /[!@#$%^&*()]/.test(pwd) },
];

// Calculates the strength score and label based on how many criteria are met
const getPasswordStrength = (password) => {
  const passedCriteriaCount = passwordCriteria.filter(criteria => criteria.test(password)).length;
  
  if (passedCriteriaCount <= 2) return { score: 25, label: 'Weak', color: 'bg-red-500' };
  if (passedCriteriaCount === 3) return { score: 50, label: 'Fair', color: 'bg-yellow-500' };
  if (passedCriteriaCount === 4) return { score: 75, label: 'Good', color: 'bg-blue-500' };
  if (passedCriteriaCount === 5) return { score: 100, label: 'Strong', color: 'bg-green-500' };
  return { score: 0, label: '', color: 'bg-gray-700' };
};

const PasswordStrengthMeter = ({ password }) => {
  const strength = getPasswordStrength(password);

  return (
    // This container has fade-in and slide-up animations
    <div className="space-y-3 pt-2 animate-fade-in-up">
      {/* 1. The Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Password Strength</span>
          <span className={`font-medium ${strength.color.replace('bg-', 'text-')}`}>
            {strength.label}
          </span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ease-in-out ${strength.color}`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
      </div>

      {/* 2. The Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-1">
        {passwordCriteria.map((criteria, index) => {
          const isPassed = criteria.test(password);
          return (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                isPassed ? 'bg-green-500' : 'bg-slate-600'
              }`}>
                {isPassed ? <Check className="w-3 h-3 text-white" /> : <X className="w-3 h-3 text-slate-400" />}
              </div>
              <span className={`text-sm transition-colors ${
                isPassed ? 'text-green-400' : 'text-slate-400'
              }`}>
                {criteria.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;