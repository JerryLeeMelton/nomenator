import { app, BrowserWindow, ipcMain, dialog } from "electron"
import path from "path"
import os from "os"
import fs from "fs/promises"
import { spawn } from "child_process"

let win: BrowserWindow | null = null

const isDev = !app.isPackaged

const createWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 950,
    minHeight: 700,
    frame: false,
    titleBarStyle: "hidden",
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

export const getPreviewBinaryPath = (): string => {
  const exeSuffix = os.platform() === "win32" ? ".exe" : ""
  if (isDev) {
    return path.join(__dirname, "../GoScripts/preview/preview" + exeSuffix)
  } else {
    return path.join(process.resourcesPath, "GoBinaries", "preview" + exeSuffix)
  }
}

export const getRenameBinaryPath = (): string => {
  const exeSuffix = os.platform() === "win32" ? ".exe" : ""
  if (isDev) {
    return path.join(__dirname, "../GoScripts/rename/rename" + exeSuffix)
  } else {
    return path.join(process.resourcesPath, "GoBinaries", "rename" + exeSuffix)
  }
}

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

// IPC Handlers for window controls
ipcMain.handle("window-minimize", () => {
  if (win) {
    win.minimize()
  }
})
ipcMain.handle("window-toggle-maximize", () => {
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  }
})
ipcMain.handle("window-close", () => {
  if (win) {
    win.close()
  }
})

ipcMain.handle("list-files", async (event, directory: string) => {
  try {
    const files = await fs.readdir(directory, { withFileTypes: true })
    return files.map((file) => ({
      name: file.name,
      isDirectory: file.isDirectory(),
    }))
  } catch (error) {
    console.error("Error reading directory:", error)
    return []
  }
})

// Run the Go script for fetching filename previews
ipcMain.handle("run-preview", async (event, payload) => {
  return new Promise((resolve, reject) => {
    try {
      const child = spawn(getPreviewBinaryPath(), [])

      let outputData = ""
      let errorData = ""

      child.stdout.on("data", (chunk) => {
        outputData += chunk
      })
      child.stderr.on("data", (chunk) => {
        errorData += chunk
      })
      child.on("close", (code) => {
        if (code === 0) {
          try {
            const parsed = JSON.parse(outputData)
            resolve(parsed)
          } catch (parseErr) {
            reject(`Failed to parse preview output: ${parseErr}`)
          }
        } else {
          reject(`Preview process exited with code ${code}: ${errorData}`)
        }
      })

      // Write JSON to stdin
      child.stdin.write(JSON.stringify(payload))
      child.stdin.end()
    } catch (err) {
      reject(err)
    }
  })
})

// Run the Go script for renaming files
ipcMain.handle("run-rename", async (event, payload) => {
  return new Promise((resolve, reject) => {
    try {
      const child = spawn(getRenameBinaryPath(), [])

      let outputData = ""
      let errorData = ""

      child.stdout.on("data", (chunk) => {
        outputData += chunk
      })
      child.stderr.on("data", (chunk) => {
        errorData += chunk
      })
      child.on("close", (code) => {
        if (code === 0) {
          try {
            const parsed = JSON.parse(outputData)
            resolve(parsed)
          } catch (parseErr) {
            reject(`Failed to parse rename output: ${parseErr}`)
          }
        } else {
          reject(`Rename process exited with code ${code}: ${errorData}`)
        }
      })

      // Write JSON to stdin
      child.stdin.write(JSON.stringify(payload))
      child.stdin.end()
    } catch (err) {
      reject(err)
    }
  })
})
