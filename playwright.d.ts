// Minimal Playwright types
declare module '@playwright/test' {
  export function test(name: string, fn: () => void): void;
  export const expect: any;
  export interface Page {}
  export interface Browser {}
  export interface BrowserContext {}
  export interface TestInfo {
    title: string;
    file: string;
  }
}

export {};