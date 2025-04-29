import { contextBridge, ipcRenderer } from "electron";
console.log("✅ preload.js загружен");

const electronAPI = {
  addRegistration: (formData: unknown) =>
    ipcRenderer.invoke("insert-registration-data", formData),

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

};

contextBridge.exposeInMainWorld("electron", electronAPI);
