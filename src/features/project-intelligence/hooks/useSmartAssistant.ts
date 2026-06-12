import { useCallback, useMemo, useState } from 'react';
import {
  aiGatewayClient,
  type SmartAssistantGatewayResponse,
  type SmartAssistantCommandId,
} from '../services/aiGateway.client';
import { buildProjectIntelligenceContext } from '../services/projectContextBuilder';

export interface SmartAssistantCommand {
  id: SmartAssistantCommandId;
  title: string;
  description: string;
  prompt: string;
  category: 'analysis' | 'planning' | 'reporting' | 'risk';
  requiresConfirmation: boolean;
}

export interface SmartAssistantRunOptions {
  activeSection?: string | null;
  extraContext?: Record<string, unknown> | null;
}

const SMART_ASSISTANT_COMMANDS: SmartAssistantCommand[] = [
  {
    id: 'delay-budget-impact',
    title: 'تحليل أثر التأخير على الميزانية',
    description: 'يحلل علاقة التأخير بالميزانية ومعدل الحرق المالي والمخاطر المتوقعة.',
    prompt: 'حلل أثر التأخير الحالي على الميزانية والالتزامات القادمة، وقدّم توصيات قابلة للمراجعة.',
    category: 'analysis',
    requiresConfirmation: true,
  },
  {
    id: 'suggest-box-links',
    title: 'اقتراح روابط بين الصناديق',
    description: 'يقترح علاقات وروابط معرفية بين صناديق العمل حسب السياق النشط.',
    prompt: 'اقترح روابط منطقية بين الصناديق بناءً على التبعيات، التشابه، والمخرجات المشتركة.',
    category: 'planning',
    requiresConfirmation: true,
  },
  {
    id: 'ideas-to-tasks',
    title: 'تحويل الأفكار إلى مهام',
    description: 'يحوّل الأفكار إلى مهام مسودة مع أولويات ومعايير قبول دون اعتماد تلقائي.',
    prompt: 'حوّل الأفكار المتاحة في السياق إلى مهام قابلة للتنفيذ مع أولويات ومعايير قبول مبدئية.',
    category: 'planning',
    requiresConfirmation: true,
  },
  {
    id: 'executive-summary',
    title: 'كتابة ملخص تنفيذي',
    description: 'ينشئ مسودة ملخص تنفيذي للحالة والقرارات المطلوبة من الإدارة.',
    prompt: 'اكتب ملخصًا تنفيذيًا موجزًا يوضح الحالة العامة والإنجازات والعوائق والقرارات المطلوبة.',
    category: 'reporting',
    requiresConfirmation: true,
  },
  {
    id: 'extract-document-risks',
    title: 'استخراج المخاطر من الوثائق',
    description: 'يستخرج مخاطر محتملة من الوثائق والسياق ويصنفها حسب الأثر والاحتمالية.',
    prompt: 'استخرج المخاطر المحتملة من الوثائق والسياق المتاح مع التصنيف والتوصيات.',
    category: 'risk',
    requiresConfirmation: true,
  },
];

export function useSmartAssistant(defaultOptions: SmartAssistantRunOptions = {}) {
  const [activeCommand, setActiveCommand] = useState<SmartAssistantCommand | null>(null);
  const [pendingCommand, setPendingCommand] = useState<SmartAssistantCommand | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SmartAssistantGatewayResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const commands = useMemo(() => SMART_ASSISTANT_COMMANDS, []);

  const executeCommand = useCallback(
    async (command: SmartAssistantCommand) => {
      setIsLoading(true);
      setError(null);

      try {
        const context = buildProjectIntelligenceContext({
          activeSection: defaultOptions.activeSection,
          commandId: command.id,
          extraContext: defaultOptions.extraContext,
        });

        const response = await aiGatewayClient.runProjectIntelligenceCommand({
          commandId: command.id,
          title: command.title,
          prompt: command.prompt,
          context,
        });

        setResult(response);
        setActiveCommand(command);
        setAssistantOpen(true);
        setConfirmationOpen(false);
        setPendingCommand(null);
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : 'تعذر تشغيل أمر الذكاء الاصطناعي.');
      } finally {
        setIsLoading(false);
      }
    },
    [defaultOptions.activeSection, defaultOptions.extraContext],
  );

  const requestCommand = useCallback((commandId: SmartAssistantCommandId) => {
    const command = SMART_ASSISTANT_COMMANDS.find((item) => item.id === commandId);
    if (!command) return;

    setActiveCommand(command);
    setAssistantOpen(true);
    setResult(null);
    setError(null);

    if (command.requiresConfirmation) {
      setPendingCommand(command);
      setConfirmationOpen(true);
      return;
    }

    void executeCommand(command);
  }, [executeCommand]);

  const confirmPendingCommand = useCallback(() => {
    if (!pendingCommand) return;
    void executeCommand(pendingCommand);
  }, [executeCommand, pendingCommand]);

  const cancelPendingCommand = useCallback(() => {
    if (isLoading) return;
    setPendingCommand(null);
    setConfirmationOpen(false);
  }, [isLoading]);

  return {
    commands,
    activeCommand,
    pendingCommand,
    assistantOpen,
    setAssistantOpen,
    confirmationOpen,
    result,
    error,
    isLoading,
    requestCommand,
    confirmPendingCommand,
    cancelPendingCommand,
  };
}
