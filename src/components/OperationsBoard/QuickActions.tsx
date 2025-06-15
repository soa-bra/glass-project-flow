
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Zap, Edit3 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const QuickActions = () => {
  const actions = [
    { id: "add_task", icon: Plus, bg: "#4AB5FF", tooltip: "إضافة مهمة جديدة" },
    { id: "ai_generate", icon: Zap, bg: "#FFCC55", tooltip: "إنشاء مهام بالذكاء الاصطناعي" },
    { id: "edit_project", icon: Edit3, bg: "#999999", tooltip: "تعديل المشروع" }
  ];

  return (
    <TooltipProvider>
      <div className="flex gap-3">
        {actions.map(action => (
          <Tooltip key={action.id}>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="rounded-full w-11 h-11 shadow-lg"
                style={{ backgroundColor: action.bg, color: 'white' }}
              >
                <action.icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{action.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
