import React, { memo, useCallback, useMemo } from 'react';

// High-Order Component for performance optimization
export const withPerformanceOptimization = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return memo(Component, areEqual);
};

// Optimized Canvas Element wrapper
export const OptimizedCanvasElement = memo<{
  element: any;
  isSelected: boolean;
  onUpdate: (id: string, updates: any) => void;
}>(({ element, isSelected, onUpdate }) => {
  const handleUpdate = useCallback(
    (updates: any) => onUpdate(element.id, updates),
    [element.id, onUpdate]
  );

  const elementStyle = useMemo(
    () => ({
      transform: `translate(${element.position.x}px, ${element.position.y}px)`,
      width: element.size.width,
      height: element.size.height,
      ...element.style,
    }),
    [element.position, element.size, element.style]
  );

  return (
    <div
      className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={elementStyle}
    >
      {element.content}
    </div>
  );
});

OptimizedCanvasElement.displayName = 'OptimizedCanvasElement';

// Optimized Tool Panel wrapper
export const OptimizedToolPanel = memo<{
  tools: any[];
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}>(({ tools, selectedTool, onToolSelect }) => {
  const toolElements = useMemo(
    () =>
      tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolSelect(tool.id)}
          className={`p-2 rounded ${
            selectedTool === tool.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {tool.label}
        </button>
      )),
    [tools, selectedTool, onToolSelect]
  );

  return <div className="flex gap-2">{toolElements}</div>;
});

OptimizedToolPanel.displayName = 'OptimizedToolPanel';

// Custom hooks for performance
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps);
};

export const useStableMemo = function<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps);
};