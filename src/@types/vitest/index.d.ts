// Vitest type definitions stub
declare module 'vitest' {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void): void;
  export function test(name: string, fn: () => void): void;
  export const expect: any;
  export const vi: any;
}

export {};