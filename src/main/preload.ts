import { contextBridge, ipcRenderer } from "electron"
import { FileItem } from "../renderer/store/fileSlice"

contextBridge.exposeInMainWorld("api", {
  pickDirectory: async () => {
    const directory = await ipcRenderer.invoke("pick-directory")
    return directory
  },
  listFiles: async (directory: string) => {
    const files = await ipcRenderer.invoke("list-files", directory)
    return files as FileItem[]
  },
  runPreview: (payload: any) => ipcRenderer.invoke("run-preview", payload),
  runRename: (payload: any) => ipcRenderer.invoke("run-rename", payload),
  // Window control APIs
  minimizeWindow: () => ipcRenderer.invoke("window-minimize"),
  toggleMaximizeWindow: () => ipcRenderer.invoke("window-toggle-maximize"),
  closeWindow: () => ipcRenderer.invoke("window-close"),
})
