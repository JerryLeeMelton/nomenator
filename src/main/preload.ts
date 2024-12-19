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
  // Window control APIs
  minimizeWindow: () => ipcRenderer.invoke("window-minimize"),
  toggleMaximizeWindow: () => ipcRenderer.invoke("window-toggle-maximize"),
  closeWindow: () => ipcRenderer.invoke("window-close"),
})
