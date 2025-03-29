interface IElectronAPI {
  addRegistration: (formData: unknown) => Promise<void>;
  searchVehicle: (searchParams: { type: string; query: string }) => Promise<any>;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}

export {}; 