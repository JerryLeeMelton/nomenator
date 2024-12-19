// src/renderer/global.d.ts
export interface NomenatorAPI {
  pickDirectory: () => Promise<string | null>
  listFiles: (directory: string) => Promise<FileItem[]>
  minimizeWindow: () => Promise<void>
  toggleMaximizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
}

declare global {
  interface Window {
    api: NomenatorAPI
  }
}
