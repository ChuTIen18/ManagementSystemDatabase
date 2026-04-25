import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
  getAppName: () => ipcRenderer.invoke('app:getName'),
  getAppPath: (name: string) => ipcRenderer.invoke('app:getPath', name),
});

// Type definitions for TypeScript
export interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  getAppName: () => Promise<string>;
  getAppPath: (name: string) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
