import React, { Component, ErrorInfo, ReactNode } from 'react';
import { canvasErrorManager } from '../utils/errorHandling';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

export class CanvasErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = `boundary-${Date.now()}`;
    
    canvasErrorManager.addError({
      code: 'REACT_ERROR_BOUNDARY',
      message: error.message,
      severity: 'high',
      context: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
        errorId
      }
    });

    this.setState({ errorId });
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  };

  private handleReportError = () => {
    if (this.state.error && this.state.errorId) {
      // In a real app, this would send to error reporting service
      console.log('Reporting error:', {
        error: this.state.error,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString()
      });
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center h-full p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle size={20} />
                حدث خطأ في التطبيق
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                عذراً، حدث خطأ غير متوقع. يمكنك المحاولة مرة أخرى أو الإبلاغ عن المشكلة.
              </p>
              
              {this.state.error && (
                <details className="text-xs bg-muted p-2 rounded">
                  <summary className="cursor-pointer font-medium">
                    تفاصيل الخطأ
                  </summary>
                  <pre className="mt-2 overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={this.handleRetry}
                  size="sm"
                  className="flex-1"
                >
                  <RefreshCw size={16} className="mr-2" />
                  إعادة المحاولة
                </Button>
                
                <Button 
                  onClick={this.handleReportError}
                  variant="outline"
                  size="sm"
                >
                  الإبلاغ عن المشكلة
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}