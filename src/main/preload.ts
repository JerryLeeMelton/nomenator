import { contextBridge, ipcRenderer } from "electron"

console.log("Preload script running")

contextBridge.exposeInMainWorld("api", {
  pickDirectory: async () => {
    const directory = await ipcRenderer.invoke("pick-directory")
    return directory
  },
})
