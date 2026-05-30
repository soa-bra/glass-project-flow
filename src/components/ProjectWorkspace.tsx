import React, { useEffect, useMemo, useState } from 'react';
import ProjectsColumn from '@/components/ProjectsColumn';
import OperationsBoard from '@/components/OperationsBoard';
import ProjectPanel from '@/components/ProjectPanel';
import { ProjectManagementBoard } from '@/components/ProjectManagement';
import { useProjectPanelAnimation } from '@/hooks/useProjectPanelAnimation';
import { ProjectTasksProvider } from '@/contexts/ProjectTasksContext';
import { Project } from '@/types/project';
import { ProjectData } from '@/types';
import { ProjectFilterOptions } from './custom/ProjectsFilterDialog';
import { ProjectSortOptions } from './custom/ProjectsSortDialog';
import {
  useArchiveProject,
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '@/hooks/central';
import { centralToUiProject, uiCreateInputToCentral } from '@/adapters/projectAdapter';
import { AuditService, PermissionsService } from '@/services/central';
import { toast } from 'sonner';

interface ProjectWorkspaceProps {
  isSidebarCollapsed: boolean;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ isSidebarCollapsed }) => {
  // Central DB remains the single source of truth for projects.
  const { data: centralProjects } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const archiveProject = useArchiveProject();
  const deleteProject = useDeleteProject();

  const centralUiProjects = useMemo<Project[]>(
    () => (centralProjects ?? []).map(centralToUiProject),
    [centralProjects],
  );

  // Central DB هي المصدر الوحيد. الفلترة/الترتيب يطبقان على نسخة محلية تُعاد مزامنتها من DB.
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(centralUiProjects);
  }, [centralUiProjects]);

  const [currentSort, setCurrentSort] = useState<ProjectSortOptions>({ sortBy: 'deadline', direction: 'asc' });

  const {
    panelStage,
    selectedProjectId,
    displayedProjectId,
    operationsBoardClass,
    projectsColumnClass,
    handleProjectSelect,
    closePanel,
  } = useProjectPanelAnimation();

  const denyProjectAction = (err: unknown, fallback: string) => {
    const description = err instanceof Error ? err.message : 'غير مصرح بتنفيذ هذا الإجراء';
    toast.error(fallback, { description });
  };

  // إضافة مشروع: تُكتب مباشرة في DB المركزي، invalidation يُحدّث القائمة.
  const handleProjectAdded = async (newProject: ProjectData) => {
    try {
      await PermissionsService.requirePermission('central.project.create', {
        action: 'central.project.create',
        resourceType: 'project',
        metadata: { name: newProject.name },
      });
    } catch (err) {
      denyProjectAction(err, 'تعذّر إنشاء المشروع');
      return;
    }

    createProject.mutate(
      uiCreateInputToCentral({
        name: newProject.name,
        description: newProject.description,
        budget: Number(newProject.budget) || undefined,
        deadline: newProject.deadline,
      }),
      {
        onSuccess: (created) => {
          toast.success(`تم إنشاء المشروع: ${created.name}`);
          void AuditService.log({
            action: 'central.project.create',
            resource_type: 'project',
            resource_id: created.id,
            metadata: { name: created.name },
          }).catch((err) => {
            // eslint-disable-next-line no-console
            console.error('[ProjectWorkspace] AuditService.log(create) failed:', err);
          });
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.error('[ProjectWorkspace] createProject failed:', err);
          toast.error('تعذّر إنشاء المشروع', {
            description: err instanceof Error ? err.message : 'خطأ غير معروف',
          });
        },
      },
    );
  };

  // تحديث مشروع
  const handleProjectUpdated = async (updatedProject: ProjectData) => {
    try {
      await PermissionsService.requirePermission('central.project.update', {
        action: 'central.project.update',
        resourceType: 'project',
        resourceId: updatedProject.id.toString(),
        metadata: { name: updatedProject.name },
      });
    } catch (err) {
      denyProjectAction(err, 'تعذّر حفظ تعديلات المشروع');
      return;
    }

    updateProject.mutate(
      {
        id: updatedProject.id.toString(),
        patch: {
          name: updatedProject.name,
          description: updatedProject.description ?? null,
          budget: Number(updatedProject.budget) || null,
          due_date: updatedProject.deadline ? new Date(updatedProject.deadline).toISOString() : null,
        },
      },
      {
        onSuccess: (p) => {
          toast.success('تم حفظ تعديلات المشروع');
          void AuditService.log({
            action: 'central.project.update',
            resource_type: 'project',
            resource_id: p.id,
          }).catch((err) => {
            // eslint-disable-next-line no-console
            console.error('[ProjectWorkspace] AuditService.log(update) failed:', err);
          });
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.error('[ProjectWorkspace] updateProject failed:', err);
          toast.error('تعذّر حفظ تعديلات المشروع', {
            description: err instanceof Error ? err.message : 'خطأ غير معروف',
          });
        },
      },
    );
  };

  const handleProjectDeleted = async (projectId: string) => {
    try {
      await PermissionsService.requirePermission('central.project.delete', {
        action: 'central.project.delete',
        resourceType: 'project',
        resourceId: projectId,
      });
    } catch (err) {
      denyProjectAction(err, 'تعذّر حذف المشروع');
      return;
    }

    deleteProject.mutate(projectId, {
      onSuccess: () => {
        toast.success('تم حذف المشروع');
        closePanel();
        void AuditService.log({
          action: 'central.project.delete',
          resource_type: 'project',
          resource_id: projectId,
        }).catch((err) => {
          // eslint-disable-next-line no-console
          console.error('[ProjectWorkspace] AuditService.log(delete) failed:', err);
        });
      },
      onError: (err) => {
        // eslint-disable-next-line no-console
        console.error('[ProjectWorkspace] deleteProject failed:', err);
        toast.error('تعذّر حذف المشروع', {
          description: err instanceof Error ? err.message : 'خطأ غير معروف',
        });
      },
    });
  };

  const handleProjectArchived = async (projectId: string) => {
    try {
      await PermissionsService.requirePermission('central.project.archive', {
        action: 'central.project.archive',
        resourceType: 'project',
        resourceId: projectId,
      });
    } catch (err) {
      denyProjectAction(err, 'تعذّرت أرشفة المشروع');
      return;
    }

    updateProject.mutate(
      {
        id: projectId,
        patch: { state: 'archived' },
      },
      {
        onSuccess: () => {
          toast.success('تمت أرشفة المشروع');
          closePanel();
          void AuditService.log({
            action: 'central.project.archive',
            resource_type: 'project',
            resource_id: projectId,
          }).catch((err) => {
            // eslint-disable-next-line no-console
            console.error('[ProjectWorkspace] AuditService.log(archive) failed:', err);
          });
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.error('[ProjectWorkspace] AuditService.log(archive) failed:', err);
        });
      },
      onError: (err) => {
        // eslint-disable-next-line no-console
        console.error('[ProjectWorkspace] archiveProject failed:', err);
        toast.error('تعذّرت أرشفة المشروع', {
          description: err instanceof Error ? err.message : 'خطأ غير معروف',
        });
      },
    });
  };

  // دالة تطبيق الفلترة
  const handleApplyFilter = (filters: ProjectFilterOptions) => {
    // TODO: Implement filtering logic
    console.log('تطبيق الفلترة:', filters);
  };

  // دالة تطبيق الترتيب
  const handleApplySort = (sortOptions: ProjectSortOptions) => {
    setCurrentSort(sortOptions);

    setProjects(prev => [...prev].sort((a, b) => {
      let comparison = 0;

      switch (sortOptions.sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title, 'ar');
          break;
        case 'status':
          const statusOrder = { success: 1, info: 2, warning: 3, error: 4 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'manager':
          comparison = a.owner.localeCompare(b.owner, 'ar');
          break;
        case 'tasks':
          comparison = (a.tasksCount || 0) - (b.tasksCount || 0);
          break;
        case 'team':
          comparison = (a.team?.length || 0) - (b.team?.length || 0);
          break;
        case 'budget':
          // استخدام value كميزانية المشروع لأن budget غير موجود في نموذج Project
          comparison = parseFloat(a.value || '0') - parseFloat(b.value || '0');
          break;
        case 'deadline':
        default:
          comparison = a.daysLeft - b.daysLeft;
          break;
      }

      return sortOptions.direction === 'desc' ? -comparison : comparison;
    }));
  };

  // Dynamically set right offsets depending on collapsed state
  const projectsColumnRight = isSidebarCollapsed ? 'var(--projects-right-collapsed)' : 'var(--projects-right-expanded)';
  const projectsColumnWidth = 'var(--projects-width)';
  const operationsBoardRight = isSidebarCollapsed ? 'var(--operations-right-collapsed)' : 'var(--operations-right-expanded)';
  const operationsBoardWidth = isSidebarCollapsed ? 'var(--operations-width-collapsed)' : 'var(--operations-width-expanded)';

  // panel content switches: always mount ProjectPanel but swap inner content with fade
  const shownProject = displayedProjectId
    ? projects.find((p) => p.id === displayedProjectId)
    : null;

  return (
    <ProjectTasksProvider>
      {/* Projects Column: shifts left when panel slides in */}
      <div
        className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] ${projectsColumnClass}`}
        style={{
          top: 'var(--sidebar-top-offset)',
          right: projectsColumnRight,
          width: projectsColumnWidth,
          transition: 'all var(--animation-duration-main) var(--animation-easing)',
          zIndex: 110,
        }}
      >
        <div
          style={{
            transition: 'all var(--animation-duration-main) var(--animation-easing)'
          }}
          className="w-full h-full p-2 py-0 mx-0 px-[5px]"
        >
          <ProjectsColumn
            projects={projects}
            selectedProjectId={selectedProjectId}
            onProjectSelect={handleProjectSelect}
            onProjectAdded={handleProjectAdded}
            onApplyFilter={handleApplyFilter}
            onApplySort={handleApplySort}
          />
        </div>
      </div>

      {/* Operations Board: slides out when panel slides in */}
      <div
        style={{
          right: operationsBoardRight,
          width: operationsBoardWidth,
          transition: 'all var(--animation-duration-main) var(--animation-easing)'
        }}
        className={`fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] mx-0 ${operationsBoardClass}`}
      >
        <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
      </div>

      {/* Project Management Board: slides in/out and crossfades content */}
      {shownProject && (
        <ProjectManagementBoard
          key={shownProject.id} // إضافة key لإعادة التحديث عند تغيير المشروع
          project={shownProject}
          isVisible={panelStage === "open" || panelStage === "changing-content"}
          onClose={closePanel}
          isSidebarCollapsed={isSidebarCollapsed}
          onProjectUpdated={handleProjectUpdated}
          onProjectDeleted={handleProjectDeleted}
          onProjectArchived={handleProjectArchived}
        />
      )}
    </ProjectTasksProvider>
  );
};

export default ProjectWorkspace;
