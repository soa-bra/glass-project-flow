/**
 * WorkspaceErrorBoundary — يلتقط الأخطاء على مستوى Workspace ويعرض fallback.
 * مطلوب في P5 (NFR #4 — Reliability).
 */
import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Telemetry } from "@/infra/telemetry";

interface State { hasError: boolean; error: Error | null; }

export class WorkspaceErrorBoundary extends React.Component<
  { children: React.ReactNode; workspaceName?: string },
  State
> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    Telemetry.reportError(error, {
      workspace: this.props.workspaceName,
      componentStack: info.componentStack,
    });
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div
        dir="rtl"
        className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7 text-red-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">حدث خطأ في {this.props.workspaceName ?? "هذا القسم"}</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          {this.state.error?.message ?? "خطأ غير متوقّع"}
        </p>
        <button
          onClick={this.reset}
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          إعادة المحاولة
        </button>
      </div>
    );
  }
}
