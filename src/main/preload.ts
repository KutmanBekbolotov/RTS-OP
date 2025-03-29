import { contextBridge, ipcRenderer } from 'electron';

const electronAPI = {
  addRegistration: (formData: unknown) => ipcRenderer.invoke('insert-registration-data', formData),
  searchVehicle: (searchParams: { type: string; query: string }) => 
    ipcRenderer.invoke('search-vehicle', searchParams),
} as const;

contextBridge.exposeInMainWorld('electron', electronAPI);

export type ElectronAPI = typeof electronAPI;