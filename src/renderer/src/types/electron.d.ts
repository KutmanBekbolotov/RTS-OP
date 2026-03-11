interface Authority {
  id: number;
  name: string;
}

interface Subdivision {
  id: number;
  authorityId: number;
  name: string;
}

interface AuthorityDirectoryItem extends Authority {
  subdivisions: Subdivision[];
}

interface IElectronAPI {
  addRegistration: (formData: unknown) => Promise<{ success: boolean; message: string }>;
  updateRegistration: (formData: unknown) => Promise<{ success: boolean; data: any }>;
  searchVehicle: (searchParams: { type: string; query: string }) => Promise<any | null>;
  checkPassword: (password: string) => Promise<boolean>;
  openPrintPreview: (html: string) => Promise<void>;
  openBrowserPrint: (html: string) => Promise<void>;
  openPDFPreview: (html: string) => Promise<string>;
  openSystemPrint: (html: string) => Promise<void>;
  printGeneratedPDF: (pdfPath: string) => Promise<void>;
  getAuthorities: () => Promise<Authority[]>;
  getAuthorityDirectory: () => Promise<AuthorityDirectoryItem[]>;
  addAuthority: (name: string) => Promise<Authority>;
  addSubdivision: (params: { authorityId: number; name: string }) => Promise<Subdivision>;
  deleteAuthority: (id: number) => Promise<{ success: boolean }>;
  deleteSubdivision: (id: number) => Promise<{ success: boolean }>;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}

export {};
