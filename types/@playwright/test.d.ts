// Type definitions for @playwright/test
declare module '@playwright/test' {
  export function test(name: string, fn: (args: { page: Page }) => Promise<void>): void;
  export const expect: any;
  
  export interface Page {
    goto(url: string): Promise<void>;
    click(selector: string): Promise<void>;
    fill(selector: string, value: string): Promise<void>;
    textContent(selector: string): Promise<string | null>;
    locator(selector: string): any;
    getByText(text: string): any;
    getAttribute(element: string, attr: string): Promise<string | null>;
    keyboard: {
      press(key: string): Promise<void>;
    };
    mouse: {
      move(x: number, y: number): Promise<void>;
      down(): Promise<void>;
      up(): Promise<void>;
    };
    evaluate(fn: () => any): Promise<any>;
  }
  
  export interface Browser {}
  export interface BrowserContext {}
  
  export interface TestInfo {
    title: string;
    file: string;
  }
}

export {};