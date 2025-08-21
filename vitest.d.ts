// Minimal vitest types
declare module 'vitest' {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void): void;
  export function test(name: string, fn: () => void): void;
  export const expect: any;
  export const vi: any;
}

// Global vitest types
declare global {
  const describe: any;
  const it: any; 
  const test: any;
  const expect: any;
  const vi: any;
}

export {};