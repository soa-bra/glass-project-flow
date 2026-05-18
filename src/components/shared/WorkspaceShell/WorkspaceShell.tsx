/**
 * WorkspaceShell — unified RTL chrome for every spec-driven workspace.
 * Provides: title bar, optional breadcrumb, optional sidebar slot, content area.
 *
 * @specRef Section 4.0.1 (Workspace Shell)
 */
import React from 'react';
import { cn } from '@/lib/utils';

export interface WorkspaceCrumb {
  label: string;
  href?: string;
}

export interface WorkspaceShellProps {
  title: string;
  subtitle?: string;
  crumbs?: WorkspaceCrumb[];
  sidebar?: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({
  title,
  subtitle,
  crumbs,
  sidebar,
  toolbar,
  children,
  className,
}) => (
  <div dir="rtl" className={cn('flex h-full w-full flex-col bg-background', className)}>
    <header className="flex flex-col gap-2 border-b border-border/60 bg-background/95 px-6 py-4">
      {crumbs && crumbs.length > 0 && (
        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-1 text-xs text-muted-foreground">
            {crumbs.map((c, i) => (
              <li key={`${c.label}-${i}`} className="flex items-center gap-1">
                {c.href ? (
                  <a href={c.href} className="hover:text-foreground transition-colors">
                    {c.label}
                  </a>
                ) : (
                  <span>{c.label}</span>
                )}
                {i < crumbs.length - 1 && <span className="opacity-50">/</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
      </div>
    </header>
    <div className="flex flex-1 overflow-hidden">
      {sidebar && (
        <aside className="w-64 shrink-0 border-s border-border/60 bg-muted/20 overflow-y-auto">{sidebar}</aside>
      )}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  </div>
);
