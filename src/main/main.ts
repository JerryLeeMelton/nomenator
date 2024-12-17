import { app, BrowserWindow, ipcMain, dialog } from "electron"
import path from "path"
import fs from "fs/promises"

console.log("Main process running (high)")

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173")
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"))
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})

console.log("Main process running (low)")

ipcMain.handle("pick-directory", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  })
  if (result.canceled || result.filePaths.length === 0) {
    return null
  } else {
    return result.filePaths[0]
  }
})

ipcMain.handle("list-files", async (event, directory: string) => {
  try {
    const files = await fs.readdir(directory, { withFileTypes: true })
    // Return file names and indicate if they are directories
    return files.map((file) => ({
      name: file.name,
      isDirectory: file.isDirectory(),
    }))
  } catch (error) {
    console.error("Error reading directory:", error)
    return []
  }
})
