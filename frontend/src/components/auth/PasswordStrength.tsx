import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi'; 

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const requirements = [
    { text: 'At least 8 characters', test: password.length >= 8 },
    { text: 'One uppercase letter', test: /[A-Z]/.test(password) },
    { text: 'One lowercase letter', test: /[a-z]/.test(password) },
    { text: 'One number', test: /[0-9]/.test(password) },
  ];

  const passedRequirements = requirements.filter(req => req.test).length;
  const strength = passedRequirements / requirements.length;

  const getStrengthColor = () => {
    if (strength <= 0.25) return 'bg-red-500';
    if (strength <= 0.5) return 'bg-orange-500';
    if (strength <= 0.75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength <= 0.25) return 'Weak';
    if (strength <= 0.5) return 'Fair';
    if (strength <= 0.75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Password strength</span>
        <span className={`font-medium ${
          strength <= 0.25 ? 'text-red-600' :
          strength <= 0.5 ? 'text-orange-600' :
          strength <= 0.75 ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {getStrengthText()}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <motion.div
          className={`h-2 rounded-full ${getStrengthColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${strength * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {requirements.map((req, index) => (
          <div
            key={index}
            className={`flex items-center gap-1 ${
              req.test ? 'text-green-600' : 'text-muted-foreground'
            }`}
          >
            {req.test ? (
              <FiCheck className="h-3 w-3" />
            ) : (
              <FiX className="h-3 w-3" />
            )}
            <span>{req.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};