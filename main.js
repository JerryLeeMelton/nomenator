const { app, BrowserWindow, ipcMain } = require("electron")
const { execFile } = require("child_process")
const path = require("path")

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "renderer.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  win.loadFile("index.html")
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

// Handle file renaming requests from the renderer process
ipcMain.handle("rename-files", async (event, files) => {
  try {
    const goExecutablePath = path.join(__dirname, "go", "file-renamer") // Adjust based on platform

    for (const file of files) {
      const { oldPath, newPath } = file
      await new Promise((resolve, reject) => {
        execFile(
          goExecutablePath,
          [oldPath, newPath],
          (error, stdout, stderr) => {
            if (error) {
              reject(stderr)
            } else {
              resolve(stdout)
            }
          }
        )
      })
    }

    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
})
