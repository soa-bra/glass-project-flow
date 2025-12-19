/**
 * LogsViewer - عارض سجلات تشغيل Workflow
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, 
  AlertTriangle, 
  XCircle, 
  Bug,
  ChevronDown,
  ChevronUp,
  Filter,
  Trash2,
  Download,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { WorkflowLogEvent, LogEventType } from '@/types/workflow-runtime';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface LogsViewerProps {
  logs: WorkflowLogEvent[];
  onClear?: () => void;
  maxHeight?: number;
  autoScroll?: boolean;
}

const levelIcons = {
  info: <Info className="w-3.5 h-3.5 text-blue-500" />,
  warn: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
  error: <XCircle className="w-3.5 h-3.5 text-red-500" />,
  debug: <Bug className="w-3.5 h-3.5 text-gray-400" />
};

const levelColors = {
  info: 'border-l-blue-500 bg-blue-50/50',
  warn: 'border-l-amber-500 bg-amber-50/50',
  error: 'border-l-red-500 bg-red-50/50',
  debug: 'border-l-gray-400 bg-gray-50/50'
};

const eventTypeLabels: Record<LogEventType, string> = {
  workflow_started: 'بدء Workflow',
  workflow_paused: 'إيقاف مؤقت',
  workflow_resumed: 'استئناف',
  workflow_completed: 'اكتمال',
  workflow_error: 'خطأ',
  node_entered: 'دخول عقدة',
  node_exited: 'خروج من عقدة',
  node_error: 'خطأ في عقدة',
  node_skipped: 'تخطي عقدة',
  condition_evaluated: 'تقييم شرط',
  action_executed: 'تنفيذ إجراء',
  action_failed: 'فشل إجراء',
  variable_updated: 'تحديث متغير',
  transition_taken: 'انتقال'
};

export function LogsViewer({ 
  logs, 
  onClear,
  maxHeight = 300,
  autoScroll = true 
}: LogsViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState<string[]>(['info', 'warn', 'error', 'debug']);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // التمرير التلقائي للأسفل
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // تصفية السجلات
  const filteredLogs = logs.filter(log => {
    if (!levelFilter.includes(log.level)) return false;
    if (filter && !log.message.toLowerCase().includes(filter.toLowerCase())) return false;
    return true;
  });

  // تصدير السجلات
  const exportLogs = () => {
    const content = filteredLogs.map(log => 
      `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden">
      {/* الرأس */}
      <div 
        className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">سجلات التشغيل</span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {filteredLogs.length}
          </span>
        </div>
        
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={exportLogs}
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
          {onClear && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-destructive"
              onClick={onClear}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            {/* فلاتر */}
            {showFilters && (
              <div className="p-2 border-b bg-muted/30 flex items-center gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[150px]">
                  <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    placeholder="بحث..."
                    className="h-7 text-xs pr-8"
                  />
                </div>
                <div className="flex gap-1">
                  {(['info', 'warn', 'error', 'debug'] as const).map(level => (
                    <Button
                      key={level}
                      variant={levelFilter.includes(level) ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => {
                        setLevelFilter(prev => 
                          prev.includes(level)
                            ? prev.filter(l => l !== level)
                            : [...prev, level]
                        );
                      }}
                    >
                      {levelIcons[level]}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* قائمة السجلات */}
            <ScrollArea 
              ref={scrollRef as any}
              style={{ maxHeight }}
              className="p-2"
            >
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  لا توجد سجلات
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredLogs.map(log => (
                    <LogEntry key={log.id} log={log} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// مكون سجل واحد
function LogEntry({ log }: { log: WorkflowLogEvent }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        border-r-2 px-2 py-1.5 rounded-sm text-xs
        ${levelColors[log.level]}
        ${log.details ? 'cursor-pointer' : ''}
      `}
      onClick={() => log.details && setExpanded(!expanded)}
    >
      <div className="flex items-start gap-2">
        <span className="flex-shrink-0 mt-0.5">{levelIcons[log.level]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted-foreground font-mono">
              {format(new Date(log.timestamp), 'HH:mm:ss.SSS')}
            </span>
            <span className="bg-muted px-1 rounded text-[10px] font-medium">
              {eventTypeLabels[log.type] || log.type}
            </span>
          </div>
          <p className="mt-0.5 text-foreground break-words">{log.message}</p>
          
          {log.details && expanded && (
            <pre className="mt-2 p-2 bg-muted rounded text-[10px] overflow-x-auto">
              {JSON.stringify(log.details, null, 2)}
            </pre>
          )}
        </div>
        
        {log.details && (
          <ChevronDown 
            className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        )}
      </div>
    </motion.div>
  );
}
