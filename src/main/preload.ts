import { contextBridge, ipcRenderer } from "electron";
console.log("✅ preload.js загружен");

const electronAPI = {
  addRegistration: (formData: unknown) =>
    ipcRenderer.invoke("insert-registration-data", formData),

  updateRegistration: (formData: unknown) =>
    ipcRenderer.invoke("update-registration-data", formData),

  searchVehicle: (searchParams: { type: string; query: string }) =>
    ipcRenderer.invoke("search-vehicle", searchParams),

  checkPassword: (password: string) =>
    ipcRenderer.invoke("check-password", password),

  openPrintPreview: (html: string) =>
    ipcRenderer.invoke("open-print-preview", html),

  openBrowserPrint: (html: string) => ipcRenderer.invoke("open-browser-print", html),

  openPDFPreview: (html: string) => ipcRenderer.invoke("generate-pdf", html),

  openSystemPrint: (html: string) => ipcRenderer.invoke('open-system-print', html),

  printGeneratedPDF: (pdfPath: string) => ipcRenderer.invoke("print-generated-pdf", pdfPath),

  getAuthorities: () => ipcRenderer.invoke("get-authorities"),

  getAuthorityDirectory: () => ipcRenderer.invoke("get-authority-directory"),

  addAuthority: (name: string) => ipcRenderer.invoke("add-authority", name),

  addSubdivision: (params: { authorityId: number; name: string }) => ipcRenderer.invoke("add-subdivision", params),

  deleteAuthority: (id: number) => ipcRenderer.invoke("delete-authority", id),

  deleteSubdivision: (id: number) => ipcRenderer.invoke("delete-subdivision", id),

  getIssuedNumbersReport: (
    filter:
      | { scope: "authority"; authorityName: string }
      | { scope: "subdivision"; subdivisionName: string }
      | null,
  ) => ipcRenderer.invoke("get-issued-numbers-report", filter),

};

contextBridge.exposeInMainWorld("electron", electronAPI);
