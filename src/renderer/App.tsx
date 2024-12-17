import React from "react"
import { useAppDispatch, useAppSelector } from "./store/hooks"
import type { RootState } from "./store/store"
import { setSelectedDirectory } from "./store/appSlice"
import { fetchFiles } from "./store/fileSlice"

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const selectedDirectory = useAppSelector(
    (state: RootState) => state.app.selectedDirectory
  )
  const files = useAppSelector((state: RootState) => state.files.items)
  const filesStatus = useAppSelector((state: RootState) => state.files.status)

  const handleSelectDirectory = () => {
    dispatch(setSelectedDirectory("/path/to/directory"))
  }

  const handleFetchFiles = () => {
    if (selectedDirectory) {
      dispatch(fetchFiles(selectedDirectory))
    } else {
      alert("Please select a directory first!")
    }
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>
      <h1>Welcome to Nomenator</h1>
      <p>Selected Directory: {selectedDirectory ?? "None"}</p>
      <button onClick={handleSelectDirectory}>Select Directory</button>

      <div style={{ marginTop: "1rem" }}>
        <h2>Files</h2>
        <button onClick={handleFetchFiles}>Fetch Files</button>
        <p>Status: {filesStatus}</p>
        {filesStatus === "succeeded" && (
          <ul>
            {files.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
