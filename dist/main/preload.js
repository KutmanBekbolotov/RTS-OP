"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electronAPI = {
    addRegistration: (formData) => electron_1.ipcRenderer.invoke('insert-registration-data', formData),
    searchVehicle: (searchParams) => electron_1.ipcRenderer.invoke('search-vehicle', searchParams),
};
electron_1.contextBridge.exposeInMainWorld('electron', electronAPI);
