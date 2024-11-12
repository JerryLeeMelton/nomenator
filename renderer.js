const { ipcRenderer } = require("electron")

document.getElementById("renameButton").addEventListener("click", async () => {
  const files = [...document.getElementById("fileInput").files].map((file) => ({
    oldPath: file.path,
    newPath: file.path.replace(/oldPattern/, "newPattern"), // Replace with desired renaming logic
  }))

  const result = await ipcRenderer.invoke("rename-files", files)
  if (result.success) {
    alert("Files renamed successfully!")
  } else {
    alert(`Error renaming files: ${result.error}`)
  }
})
