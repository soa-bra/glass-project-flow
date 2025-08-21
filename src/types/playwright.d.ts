// Minimal Playwright type declarations to satisfy tsconfig
declare module '@playwright/test' {
  export const test: any;
  export const expect: any;
  export const Page: any;
  export const Browser: any;
  export const BrowserContext: any;
}

// Global Playwright types
declare global {
  namespace PlaywrightTest {
    interface TestInfo {
      title: string;
      file: string;
    }
  }
}

export {};