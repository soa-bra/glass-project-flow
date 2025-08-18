import React from 'react';

interface ProjectFormErrorsProps {
  validationErrors?: string[];
}

export const ProjectFormErrors: React.FC<ProjectFormErrorsProps> = ({
  validationErrors = []
}) => {
  if (validationErrors.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-3 border border-red-500 rounded-3xl">
      <p className="text-red-700 font-medium text-sm font-arabic mb-2">يرجى إكمال الحقول التالية:</p>
      <ul className="text-red-600 text-sm font-arabic space-y-1">
        {validationErrors.map((error, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
};