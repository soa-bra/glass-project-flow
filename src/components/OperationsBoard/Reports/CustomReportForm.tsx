
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export const CustomReportForm: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');

  const availableSections = [
    { id: 'projects', label: 'المشاريع' },
    { id: 'finance', label: 'المالية' },
    { id: 'legal', label: 'القانونية' },
    { id: 'hr', label: 'الموارد البشرية' },
    { id: 'clients', label: 'العملاء' },
  ];

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div>
      <h3 className="text-xl font-arabic font-medium text-right mb-4">إنشاء تقرير مخصص</h3>
      
      <div className="glass-enhanced rounded-[40px] p-6 transition-all duration-200 ease-in-out">
        {/* نطاق التاريخ */}
        <div className="mb-6">
          <h4 className="font-medium text-right mb-2">الفترة الزمنية</h4>
          <div className="flex flex-col md:flex-row gap-4 justify-end">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 text-right mb-1">إلى</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white/70 border border-gray-300 rounded-md px-3 py-2 text-right"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 text-right mb-1">من</label>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white/70 border border-gray-300 rounded-md px-3 py-2 text-right"
              />
            </div>
          </div>
        </div>
        
        {/* خيارات المحتوى */}
        <div className="mb-6">
          <h4 className="font-medium text-right mb-2">محتوى التقرير</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableSections.map(section => (
              <label 
                key={section.id}
                className="flex items-center space-x-2 space-x-reverse gap-2 cursor-pointer bg-white/50 hover:bg-white/70 transition-colors px-3 py-2 rounded-md"
                dir="rtl"
              >
                <Checkbox
                  id={`section-${section.id}`}
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={() => handleSectionToggle(section.id)}
                />
                <span>{section.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* تنسيق التصدير */}
        <div className="mb-6">
          <h4 className="font-medium text-right mb-2">تنسيق التقرير</h4>
          <div className="flex justify-end gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="format" 
                value="excel" 
                checked={selectedFormat === 'excel'}
                onChange={() => setSelectedFormat('excel')}
                className="w-4 h-4"
              />
              <span>Excel</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="format" 
                value="pdf" 
                checked={selectedFormat === 'pdf'}
                onChange={() => setSelectedFormat('pdf')}
                className="w-4 h-4"
              />
              <span>PDF</span>
            </label>
          </div>
        </div>
        
        {/* زر التصدير */}
        <div className="flex justify-center mt-8">
          <button 
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            تصدير التقرير
          </button>
        </div>
      </div>
    </div>
  );
};
