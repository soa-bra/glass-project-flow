import React, { useState } from 'react';
import { FileUp, Layout, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePlanningStore } from '@/stores/planningStore';
import BoardsGrid from './BoardsGrid';
import TemplateSelector from './TemplateSelector';
import FileUploadModal from './FileUploadModal';

const PlanningEntryScreen = () => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const { createBoard } = usePlanningStore();

  const handleNewBlank = () => {
    createBoard('blank');
  };

  const handleTemplate = () => {
    setShowTemplates(true);
  };

  const handleFile = () => {
    setShowFileUpload(true);
  };

  return (
    <div className="h-full flex flex-col p-8 bg-[hsl(var(--sb-column-3-bg))]">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-[32px] font-bold text-[hsl(var(--ink))] mb-4">
          مساحة التخطيط التضامني
        </h1>
        <p className="text-[14px] text-[hsl(var(--ink-60))]">
          ابدأ لوحة جديدة أو تابع العمل على لوحة محفوظة
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        <ActionCard
          icon={<Plus size={32} />}
          title="جديد"
          description="بدء لوحة كانفاس فارغة"
          onClick={handleNewBlank}
        />
        <ActionCard
          icon={<Layout size={32} />}
          title="قالب"
          description="استخدام قالب معد مسبقًا"
          onClick={handleTemplate}
        />
        <ActionCard
          icon={<FileUp size={32} />}
          title="ملف"
          description="رفع ملف وتحليله تلقائيًا"
          onClick={handleFile}
        />
      </div>

      {/* Boards Grid */}
      <BoardsGrid />

      {/* Modals */}
      {showTemplates && (
        <TemplateSelector onClose={() => setShowTemplates(false)} />
      )}
      {showFileUpload && (
        <FileUploadModal onClose={() => setShowFileUpload(false)} />
      )}
    </div>
  );
};

// Action Card Component
const ActionCard = ({ icon, title, description, onClick }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="group relative overflow-hidden rounded-[24px] bg-white border border-[hsl(var(--border))] p-8 text-right transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
  >
    <div className="flex flex-col gap-4">
      <div className="w-12 h-12 rounded-full bg-[hsl(var(--panel))] flex items-center justify-center text-[hsl(var(--ink))] group-hover:bg-[hsl(var(--accent-green))] group-hover:text-white transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-[20px] font-bold text-[hsl(var(--ink))] mb-2">{title}</h3>
        <p className="text-[13px] text-[hsl(var(--ink-60))]">{description}</p>
      </div>
    </div>
  </motion.button>
);

export default PlanningEntryScreen;
