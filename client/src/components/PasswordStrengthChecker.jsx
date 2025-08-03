import React from "react";
import { Check, X } from "lucide-react";

const PasswordStrengthChecker = ({ password }) => {
  // Password strength criteria
  const criteria = [
    {
      label: "At least 8 characters",
      test: (pwd) => pwd.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      label: "Contains lowercase letter",
      test: (pwd) => /[a-z]/.test(pwd),
    },
    {
      label: "Contains number",
      test: (pwd) => /\d/.test(pwd),
    },
    {
      label: "Contains special character",
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

  // Calculate strength
  const passedCriteria = criteria.filter((criterion) =>
    criterion.test(password)
  );
  const strengthPercentage = (passedCriteria.length / criteria.length) * 100;

  // Get strength level and color
  const getStrengthInfo = () => {
    if (strengthPercentage === 0) return { level: "", color: "bg-muted" };
    if (strengthPercentage <= 40)
      return { level: "Weak", color: "bg-destructive" };
    if (strengthPercentage <= 60)
      return { level: "Fair", color: "bg-yellow-500" };
    if (strengthPercentage <= 80)
      return { level: "Good", color: "bg-blue-500" };
    return { level: "Strong", color: "bg-green-500" };
  };

  const { level, color } = getStrengthInfo();

  // Don't show checker if password is empty
  if (!password) return null;

  return (
    <div className="mt-3 p-4 bg-card border rounded-lg">
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">
            Password Strength
          </span>
          {level && (
            <span
              className={`text-sm font-semibold ${
                level === "Weak"
                  ? "text-destructive"
                  : level === "Fair"
                  ? "text-yellow-600 dark:text-yellow-400"
                  : level === "Good"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {level}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${strengthPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Criteria checklist */}
      <div className="space-y-2">
        {criteria.map((criterion, index) => {
          const isValid = criterion.test(password);
          return (
            <div key={index} className="flex items-center space-x-2">
              {isValid ? (
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <span
                className={`text-sm ${
                  isValid
                    ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground"
                }`}
              >
                {criterion.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthChecker;
