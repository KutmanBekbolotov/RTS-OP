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

type ReportFilter =
  | { scope: "authority"; authorityName: string }
  | { scope: "subdivision"; subdivisionName: string };

interface AuthorityIssuedSummary {
  authorityName: string;
  issuedCount: number;
}

interface SubdivisionIssuedSummary {
  subdivisionName: string;
  issuedCount: number;
}

interface IssuedNumberDetail {
  stateNumber: string;
  techPassportNumber: string | null;
}

interface IssuedNumbersReport {
  summaryByAuthorities: AuthorityIssuedSummary[];
  summaryBySubdivisions: SubdivisionIssuedSummary[];
  details: IssuedNumberDetail[];
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
  getIssuedNumbersReport: (filter: ReportFilter | null) => Promise<IssuedNumbersReport>;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}

export {};
