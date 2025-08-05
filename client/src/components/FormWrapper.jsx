import React, { ReactNode } from 'react';

export const FormWrapper= ({ 
  title, 
  subtitle, 
  children, 
  className = '' 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-md ${className}`}>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            {subtitle && (
              <p className="text-gray-600">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};