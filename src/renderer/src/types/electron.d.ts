interface IElectronAPI {
  addRegistration: (formData: unknown) => Promise<void>;
  searchVehicle: (searchParams: { type: string; query: string }) => Promise<any>;
  checkPassword: (password: string) => Promise<boolean>;
  openPrintPreview: (html: string) => Promise<void>;
  openBrowserPrint: (html: string) => Promise<void>; 
  openPDFPreview: (html: string) => Promise<string>; 
  openPDFWindow: (path: string) => Promise<void>; 
  openSystemPrint: (html: string) => Promise<void>;
  printGeneratedPDF: (pdfPath: string) => Promise<void>; 
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}

export {};