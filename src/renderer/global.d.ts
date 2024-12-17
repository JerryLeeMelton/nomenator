// src/renderer/global.d.ts
export interface NomenatorAPI {
  pickDirectory: () => Promise<string | null>
  listFiles: (directory: string) => Promise<FileItem[]>
  // add more IPC-exposed methods as you implement them
}

declare global {
  interface Window {
    api: NomenatorAPI
  }
}
