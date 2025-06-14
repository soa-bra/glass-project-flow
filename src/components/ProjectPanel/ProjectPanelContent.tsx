
import React from "react";
import { Progress } from "@/components/ui/progress";
import { SoaBraBadge } from "@/components/ui/SoaBraBadge";
import { User } from "lucide-react";

interface ProjectPanelContentProps {
  project: {
    title: string;
    description: string;
    owner: string;
    value: string;
    daysLeft: number;
    team?: { name: string; avatar?: string }[];
    progress?: number;
    links?: { label: string; url: string }[];
  };
}

const DUMMY_TEAM = [
  { name: "د. أسامة", avatar: "" },
  { name: "م. سارة", avatar: "" },
  { name: "أ. فاطمة", avatar: "" },
];

const DUMMY_LINKS = [
  { label: "الملفات المرفقة", url: "#" },
  { label: "رابط المشروع", url: "#" }
];

export default function ProjectPanelContent({ project }: ProjectPanelContentProps) {
  // يمكن إلحاق مزيد من الداتا مستقبلا من project props
  const progress = project.progress ?? 68; // افتراضي
  const team = project.team ?? DUMMY_TEAM;
  const links = project.links ?? DUMMY_LINKS;

  return (
    <div className="flex flex-col gap-8 w-full h-full font-arabic">
      {/* مؤشر التقدم */}
      <div className="flex items-center gap-4 mt-1">
        <span style={{
          fontSize: 16,
          color: "#607080",
          minWidth: 70,
          fontWeight: 500
        }}>
          إنجاز
        </span>
        <div className="flex-1 flex items-center">
          <Progress
            value={progress}
            indicatorClassName="bg-soabra-primary-blue transition-all duration-500"
            className="h-[16px] bg-white/35 border border-white/30 w-full rounded-full shadow-sm"
          />
        </div>
        <span className="font-extrabold text-soabra-primary-blue drop-shadow-sm mr-4" style={{fontSize:19}}>{progress}%</span>
      </div>

      {/* وصف مختصر وشارات المشروع */}
      <div className="flex items-end justify-between gap-8">
        {/* بطاقة وصف مختصر */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-heading-sub text-soabra-primary-blue font-bold font-arabic mb-1 text-right">
            ملخص المشروع
          </div>
          <div className="text-body font-arabic text-right text-gray-800 leading-relaxed">
            {project.description}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            <SoaBraBadge variant="info" size="sm" className="font-arabic">{`عدد الأيام المتبقية: ${project.daysLeft}`}</SoaBraBadge>
            <SoaBraBadge variant="success" size="sm" className="font-arabic">{`قيمة المشروع: ${project.value} ر.س`}</SoaBraBadge>
          </div>
        </div>
        {/* شارات الفريق */}
        <div className="flex flex-row flex-shrink-0 gap-2 items-center px-2">
          {team.map((member, idx) => (
            <div
              key={member.name + idx}
              className="relative flex items-center justify-center w-[40px] h-[40px]"
              title={member.name}
            >
              <div className="rounded-full glass-enhanced border border-white/40 w-10 h-10 flex items-center justify-center shadow-md overflow-hidden">
                {member.avatar ?
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-full" />
                  : <User size={22} className="text-soabra-primary-blue" />}
              </div>
              <span className="absolute bottom-0 left-0 bg-white/60 rounded-full px-1 text-xs font-bold text-gray-700 shadow-sm">{member.name.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* روابط وملفات المشروع المهمة */}
      <div className="mt-2 flex flex-row flex-wrap items-center gap-2 justify-end">
        {links.map((link, idx) => (
          <a
            key={link.label + idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-soabra-primary-blue font-bold hover:bg-soabra-primary-blue/10 transition rounded px-2 py-1"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
