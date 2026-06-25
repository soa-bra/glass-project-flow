import Sidebar from '@/components/Sidebar';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import { WorkspaceErrorBoundary } from '@/components/shared/WorkspaceErrorBoundary';
import { CrossWorkspaceSearch } from '@/features/cross-search';
import { Loader2, Search, FileSearch, BrainCircuit, Sparkles } from 'lucide-react';
import { registerAIContextSource } from '@/features/ai/context/projectContextBuilder';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useSmartAssistant } from '@/features/project-intelligence/hooks/useSmartAssistant';
import type { SmartAssistantCommandId } from '@/features/project-intelligence/services/aiGateway.client';
import { SoaBraAIAssistant } from '@/features/project-intelligence/components/SoaBraAIAssistant';
import { SmartConfirmationDialog } from '@/components/shared/SmartConfirmationDialog';

const ProjectWorkspace = lazy(() => import('./ProjectWorkspace'));
const DepartmentsWorkspace = lazy(() => import('./DepartmentsWorkspace'));
const ArchiveWorkspace = lazy(() => import('./ArchiveWorkspace'));
const SettingsWorkspace = lazy(() => import('./SettingsWorkspace'));
const PlanningWorkspace = lazy(() => import('./PlanningWorkspace'));

const WorkspaceFallback = () => (
  <div className="flex-1 flex items-center justify-center">
    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
  </div>
);

const MainContent = () => {
  const { navigationState, setActiveSection } = useNavigation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [previousSidebarState, setPreviousSidebarState] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const smartAssistant = useSmartAssistant({ activeSection: navigationState.activeSection });
  const forceCollapsed = navigationState.activeSection === 'planning';
  const effectiveCollapsed = forceCollapsed || isSidebarCollapsed;

  useEffect(() => {
    if (navigationState.activeSection !== 'planning') {
      setIsSidebarCollapsed(previousSidebarState);
    }
  }, [navigationState.activeSection, previousSidebarState]);

  useEffect(() => {
    return registerAIContextSource({
      id: 'main-content-route',
      kind: 'navigation',
      data: {
        activeSection: navigationState.activeSection,
        active_tab: { id: navigationState.activeSection, label: navigationState.activeSection },
        visible_boxes: [{ id: `${navigationState.activeSection}-workspace`, source: 'MainContent' }],
      },
      permission_scope: { role: 'viewer', allowed: true },
    });
  }, [navigationState.activeSection]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
    if (navigationState.activeSection !== 'planning') {
      setPreviousSidebarState(collapsed);
    }
  };

  const handleSectionChange = (section: string) => {
    if (section === 'planning' && navigationState.activeSection !== 'planning') {
      setPreviousSidebarState(isSidebarCollapsed);
    }

    if (navigationState.activeSection === 'planning' && section !== 'planning') {
      setIsSidebarCollapsed(previousSidebarState);
    }

    setActiveSection(section);
  };

  const openCrossWorkspaceSearch = () => {
    setPaletteOpen(false);
    setSearchOpen(true);
  };

  const runSmartCommand = (commandId: SmartAssistantCommandId) => {
    setPaletteOpen(false);
    smartAssistant.requestCommand(commandId);
  };

  const renderWorkspace = () => {
    switch (navigationState.activeSection) {
      case 'departments':
        return <DepartmentsWorkspace isSidebarCollapsed={effectiveCollapsed} />;
      case 'planning':
        return <PlanningWorkspace isSidebarCollapsed={effectiveCollapsed} />;
      case 'archive':
        return <ArchiveWorkspace isSidebarCollapsed={effectiveCollapsed} />;
      case 'settings':
        return <SettingsWorkspace isSidebarCollapsed={effectiveCollapsed} />;
      default:
        return <ProjectWorkspace isSidebarCollapsed={effectiveCollapsed} />;
    }
  };

  return (
    <div className="flex h-screen pt-[var(--header-height)] overflow-hidden px-0 mx-0 bg-slate-100">
      <div
        style={{ transition: 'all var(--animation-duration-main) var(--animation-easing)' }}
        className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] z-sidebar sidebar-layout bg-slate-100"
      >
        <Sidebar
          onToggle={handleSidebarToggle}
          activeSection={navigationState.activeSection}
          onSectionChange={handleSectionChange}
          forceCollapsed={forceCollapsed}
          collapsed={isSidebarCollapsed}
        />
      </div>

      <WorkspaceErrorBoundary workspaceName={navigationState.activeSection}>
        <Suspense fallback={<WorkspaceFallback />}>
          {renderWorkspace()}
        </Suspense>
      </WorkspaceErrorBoundary>

      <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <CommandInput placeholder="ابحث أو شغّل أمرًا ذكيًا…" dir="rtl" className="font-arabic text-right" />
        <CommandList className="max-h-[420px] font-arabic" dir="rtl">
          <CommandEmpty>لا توجد أوامر مطابقة.</CommandEmpty>
          <CommandGroup heading="البحث الموحد">
            <CommandItem onSelect={openCrossWorkspaceSearch} value="بحث شامل cross workspace search">
              <Search className="ml-2 h-4 w-4" />
              <div className="flex flex-col text-right">
                <span>بحث شامل في مساحات العمل</span>
                <span className="text-xs text-muted-foreground">افتح CrossWorkspaceSearch من داخل الـ palette.</span>
              </div>
              <CommandShortcut className="mr-auto ml-0">بحث</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="أوامر الذكاء الاصطناعي">
            {smartAssistant.commands.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => runSmartCommand(command.id)}
                value={`${command.title} ${command.description}`}
              >
                {command.category === 'risk' ? (
                  <FileSearch className="ml-2 h-4 w-4" />
                ) : command.category === 'analysis' ? (
                  <BrainCircuit className="ml-2 h-4 w-4" />
                ) : (
                  <Sparkles className="ml-2 h-4 w-4" />
                )}
                <div className="flex flex-col text-right">
                  <span>{command.title}</span>
                  <span className="text-xs text-muted-foreground">{command.description}</span>
                </div>
                <CommandShortcut className="mr-auto ml-0">AI</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <CrossWorkspaceSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <SoaBraAIAssistant
        open={smartAssistant.assistantOpen}
        command={smartAssistant.activeCommand}
        result={smartAssistant.result}
        isLoading={smartAssistant.isLoading}
        error={smartAssistant.error}
        onOpenChange={smartAssistant.setAssistantOpen}
      />
      <SmartConfirmationDialog
        open={smartAssistant.confirmationOpen}
        title={smartAssistant.pendingCommand?.title}
        description={smartAssistant.pendingCommand?.description}
        onConfirm={smartAssistant.confirmPendingCommand}
        onCancel={smartAssistant.cancelPendingCommand}
      />
    </div>
  );
};

export default MainContent;
