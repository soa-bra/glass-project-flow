
import React from 'react';
import { Download } from 'lucide-react';

export const ExportButton: React.FC = () => {
  return (
    <button className="w-8 h-8 rounded-full border border-black/20 bg-transparent hover:bg-white/20 flex items-center justify-center">
      <Download className="w-4 h-4 text-black" />
    </button>
  );
};
