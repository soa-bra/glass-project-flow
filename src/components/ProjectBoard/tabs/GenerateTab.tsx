
import React, { useState } from 'react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface GenerateTabProps {
  project: ProjectCardProps;
}

const GenerateTab: React.FC<GenerateTabProps> = ({ project }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="rounded-3xl backdrop-blur-3xl bg-white/40 p-6 h-full">
      <h3 className="text-xl font-bold font-arabic text-gray-800 mb-6">توليد المهام</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-arabic text-gray-600 mb-2">نوع المهام</label>
          <select className="w-full p-3 bg-white/40 rounded-xl font-arabic text-gray-700 border-none">
            <option>مهام التطوير</option>
            <option>مهام التصميم</option>
            <option>مهام الاختبار</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-arabic text-gray-600 mb-2">عدد المهام</label>
          <input 
            type="number" 
            defaultValue={5}
            className="w-full p-3 bg-white/40 rounded-xl font-arabic text-gray-700 border-none"
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full p-4 bg-white/40 hover:bg-white/60 rounded-xl font-arabic text-gray-800 transition-colors duration-200 disabled:opacity-50"
        >
          {isGenerating ? 'جاري التوليد...' : 'توليد المهام'}
        </button>

        {isGenerating && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateTab;
