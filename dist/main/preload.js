"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
console.log("✅ preload.js загружен");
const electronAPI = {
    addRegistration: (formData) => electron_1.ipcRenderer.invoke("insert-registration-data", formData),
    searchVehicle: (searchParams) => electron_1.ipcRenderer.invoke("search-vehicle", searchParams),
    checkPassword: (password) => electron_1.ipcRenderer.invoke("check-password", password),
    openPrintPreview: (html) => electron_1.ipcRenderer.invoke("open-print-preview", html),
    openBrowserPrint: (html) => electron_1.ipcRenderer.invoke("open-browser-print", html),
    openPDFPreview: (html) => electron_1.ipcRenderer.invoke("generate-pdf", html),
    openSystemPrint: (html) => electron_1.ipcRenderer.invoke('open-system-print', html),
    printGeneratedPDF: (pdfPath) => electron_1.ipcRenderer.invoke("print-generated-pdf", pdfPath),
    getAuthorities: () => electron_1.ipcRenderer.invoke("get-authorities"),
    getAuthorityDirectory: () => electron_1.ipcRenderer.invoke("get-authority-directory"),
    addAuthority: (name) => electron_1.ipcRenderer.invoke("add-authority", name),
    addSubdivision: (params) => electron_1.ipcRenderer.invoke("add-subdivision", params),
    deleteAuthority: (id) => electron_1.ipcRenderer.invoke("delete-authority", id),
    deleteSubdivision: (id) => electron_1.ipcRenderer.invoke("delete-subdivision", id),
};
electron_1.contextBridge.exposeInMainWorld("electron", electronAPI);
