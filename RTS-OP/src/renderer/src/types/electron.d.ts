interface IElectronAPI {
  addRegistration: (formData: unknown) => Promise<void>;
  searchVehicle: (searchParams: { type: string; query: string }) => Promise<any>;
  checkPassword: (password: string) => Promise<boolean>;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}

export {}; 