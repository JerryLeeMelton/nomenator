export interface NomenatorAPI {
  pickDirectory: () => Promise<string | null>
  listFiles: (directory: string) => Promise<FileItem[]>
  minimizeWindow: () => Promise<void>
  toggleMaximizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
  runPreview: (payload: any) => Promise<any>
  runRename: (payload: any) => Promise<any>
}

declare global {
  interface Window {
    api: NomenatorAPI
  }
}
