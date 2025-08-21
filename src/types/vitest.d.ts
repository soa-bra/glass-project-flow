// Minimal vitest type declarations to satisfy tsconfig
declare module 'vitest' {
  export const describe: any;
  export const it: any;
  export const test: any;
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