import React, { useState } from 'react';
import { Brain, Cable, FileText, FileUp, Layout, Plus, Users, Workflow } from 'lucide-react';
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
      <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-[30px] font-bold text-[hsl(var(--ink))] mb-3">
            مساحة التخطيط التضامني
          </h1>
          <p className="text-[14px] text-[hsl(var(--ink-60))] max-w-3xl leading-7">
            كانفاس حي للتخطيط، التعاون، توليد المستندات، إنشاء الموصلات الدلالية، وتحويل الأفكار إلى مشاريع ومهام وسجلات تنفيذية مرتبطة.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 min-w-[min(100%,520px)]">
          <CapabilityPill icon={<Users size={15} />} label="حضور لحظي" />
          <CapabilityPill icon={<Brain size={15} />} label="AI سياقي" />
          <CapabilityPill icon={<Cable size={15} />} label="موصلات ذكية" />
          <CapabilityPill icon={<Workflow size={15} />} label="تحويل للتنفيذ" />
        </div>
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

      <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-3">
        <ReadinessCard icon={<FileText size={18} />} title="المستندات الذكية" description="توليد وثيقة أو جدول من التحديد وربطها بالعناصر المصدر." />
        <ReadinessCard icon={<Cable size={18} />} title="العلاقات الدلالية" description="اسحب من anchors لإنشاء علاقة references أو depends_on أو blocks." />
        <ReadinessCard icon={<Workflow size={18} />} title="التحويل التنفيذي" description="حوّل التخطيط إلى مشروع أو مهمة مع مراجعة وربط وتدقيق." />
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

const CapabilityPill = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-white px-3 py-2 text-[12px] font-semibold text-[hsl(var(--ink))]">
    <span className="text-[hsl(var(--accent-green))]">{icon}</span>
    {label}
  </div>
);

const ReadinessCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="rounded-lg border border-[hsl(var(--border))] bg-white/80 p-4">
    <div className="mb-2 flex items-center gap-2 text-[hsl(var(--ink))]">
      <span className="text-[hsl(var(--accent-green))]">{icon}</span>
      <h3 className="text-[13px] font-bold">{title}</h3>
    </div>
    <p className="text-[12px] leading-6 text-[hsl(var(--ink-60))]">{description}</p>
  </div>
);

export default PlanningEntryScreen;
