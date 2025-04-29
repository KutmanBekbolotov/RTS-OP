declare module 'electron-print-preview' {
    export function createPrintWindow(options: { html: string }): Promise<void>;
  }
  