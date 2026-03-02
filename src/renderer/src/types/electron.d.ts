interface IElectronAPI {
  addRegistration: (formData: unknown) => Promise<{ success: boolean; message: string }>;
  searchVehicle: (searchParams: { type: string; query: string }) => Promise<any | null>;
  checkPassword: (password: string) => Promise<boolean>;
  openPrintPreview: (html: string) => Promise<void>;
  openBrowserPrint: (html: string) => Promise<void>;
  openPDFPreview: (html: string) => Promise<string>;
  openSystemPrint: (html: string) => Promise<void>;
  printGeneratedPDF: (pdfPath: string) => Promise<void>;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}

export {};
