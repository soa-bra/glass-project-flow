/// <reference types="vite/client" />

// Ambient module declarations for missing test frameworks
declare module 'vitest' {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void): void;
  export function test(name: string, fn: () => void): void;
  export const expect: any;
  export const vi: any;
  export const beforeEach: any;
  export const afterEach: any;
  export const beforeAll: any;
  export const afterAll: any;
}

declare module '@playwright/test' {
  export function test(name: string, fn: (args: any) => Promise<void>): void;
  export const expect: any;
  export interface Page {
    goto(url: string): Promise<void>;
    click(selector: string): Promise<void>;
    fill(selector: string, value: string): Promise<void>;
    textContent(selector: string): Promise<string | null>;
  }
  export interface Browser {}
  export interface BrowserContext {}
  export interface TestInfo {
    title: string;
    file: string;
  }
}

// Global test environment types
declare global {
  const describe: typeof import('vitest').describe;
  const it: typeof import('vitest').it;
  const test: typeof import('vitest').test;
  const expect: typeof import('vitest').expect;
  const vi: typeof import('vitest').vi;
}

export {};