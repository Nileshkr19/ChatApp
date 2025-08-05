import React, { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';



export const InputField = forwardRef(
  ({ label, error, showPasswordToggle, onTogglePassword, showPassword, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200 bg-white placeholder-gray-400
              ${error ? 'border-red-500 focus:ring-red-500' : ''}
              ${showPasswordToggle ? 'pr-12' : ''}
              ${className}
            `}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';