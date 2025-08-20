import { useCallback, useRef } from 'react';

/**
 * Creates a debounced version of a callback function
 * @param callback The function to debounce
 * @param delay Delay in milliseconds
 * @param deps Dependency array for the callback
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay, ...deps]
  ) as T;

  return debouncedCallback;
}