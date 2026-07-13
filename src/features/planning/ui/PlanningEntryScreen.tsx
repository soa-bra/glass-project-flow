import React, { useState } from 'react';
import { FileUp, Layout, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePlanningStore } from '@/stores/planningStore';
import BoardsGrid from '@/features/planning/ui/widgets/BoardsGrid';
import TemplateSelector from '@/features/planning/ui/widgets/TemplateSelector';
import FileUploadModal from './overlays/FileUploadModal';

const PlanningEntryScreen = () => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const { boards, createBoard } = usePlanningStore();

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
    <div className="h-full flex flex-col p-6 lg:p-8 bg-[hsl(var(--sb-column-3-bg))] overflow-y-auto" dir="rtl">
      <div className="mb-8">
        <h1 className="text-[30px] font-bold text-[hsl(var(--ink))] mb-3">
          مساحة التخطيط التضامني
        </h1>
        <p className="text-[14px] text-[hsl(var(--ink-60))] max-w-3xl leading-7">
          كانفاس حي للتخطيط، التعاون، توليد المستندات، إنشاء الموصلات الدلالية، وتحويل الأفكار إلى مشاريع ومهام وسجلات تنفيذية مرتبطة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <ActionCard
          icon={<Plus size={32} />}
          title="لوحة فارغة"
          description="كانفاس لا نهائي مع شبكة وأدوات تحرير وربط"
          onClick={handleNewBlank}
          meta="جاهزة للتعاون"
        />
        <ActionCard
          icon={<Layout size={32} />}
          title="قالب"
          description="بداية منظمة لمسارات العمل والمشاريع"
          onClick={handleTemplate}
          meta="قابل للتحويل"
        />
        <ActionCard
          icon={<FileUp size={32} />}
          title="رفع ملف"
          description="تحويل الملفات إلى عناصر ومستندات داخل اللوحة"
          onClick={handleFile}
          meta="Smart Docs"
        />
      </div>


      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[hsl(var(--ink))]">اللوحات المحفوظة</h2>
        <span className="text-[12px] text-[hsl(var(--ink-60))]">{boards.length} لوحة</span>
      </div>
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
const ActionCard = ({ icon, title, description, onClick, meta }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  meta: string;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="group relative overflow-hidden rounded-lg bg-white border border-[hsl(var(--border))] p-6 text-right transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
  >
    <div className="flex flex-col gap-4 min-h-[148px]">
      <div className="w-12 h-12 rounded-full bg-[hsl(var(--panel))] flex items-center justify-center text-[hsl(var(--ink))] group-hover:bg-[hsl(var(--accent-green))] group-hover:text-white transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-[20px] font-bold text-[hsl(var(--ink))] mb-2">{title}</h3>
        <p className="text-[13px] text-[hsl(var(--ink-60))] leading-6">{description}</p>
      </div>
      <span className="mt-auto inline-flex w-fit rounded-full bg-[hsl(var(--panel))] px-3 py-1 text-[11px] font-semibold text-[hsl(var(--ink-60))]">
        {meta}
      </span>
    </div>
  </motion.button>
);


export default PlanningEntryScreen;
