
import React from 'react';

interface ReportTemplate {
  id: number;
  name: string;
}

interface TemplatesListProps {
  templates: ReportTemplate[];
}

export const TemplatesList: React.FC<TemplatesListProps> = ({ templates }) => {
  return (
    <div>
      <h3 className="text-xl font-arabic font-medium text-right mb-4">النماذج الجاهزة</h3>
      
      <div className="glass-enhanced rounded-[40px] p-4 transition-all duration-200 ease-in-out">
        <ul className="space-y-3">
          {templates.map(template => (
            <li key={template.id} className="border-b border-gray-200/60 last:border-0 pb-2 last:pb-0">
              <div className="flex justify-between items-center">
                <button 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  aria-label="تحميل التقرير"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <h4 className="font-medium text-right">{template.name}</h4>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
