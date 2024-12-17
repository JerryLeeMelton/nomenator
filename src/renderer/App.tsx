import React from "react"
import { useAppDispatch, useAppSelector } from "./store/hooks"
import type { RootState } from "./store/store"
import { setSelectedDirectory } from "./store/appSlice"
import { fetchFilesThunk } from "./store/fileSlice"
import { pickDirectoryThunk } from "./store/appSlice"

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const selectedDirectory = useAppSelector(
    (state: RootState) => state.app.selectedDirectory
  )
  const files = useAppSelector((state: RootState) => state.files.items)
  const filesStatus = useAppSelector((state: RootState) => state.files.status)

  const handleSelectDirectory = () => {
    dispatch(pickDirectoryThunk())
  }

  const handleFetchFiles = () => {
    if (selectedDirectory) {
      dispatch(fetchFilesThunk(selectedDirectory))
    } else {
      alert("Please select a directory first!")
    }
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>
      <h1>Welcome to Nomenator</h1>
      <p>Selected Directory: {selectedDirectory ?? "None"}</p>
      <button onClick={handleSelectDirectory}>Pick a Directory</button>

      {selectedDirectory && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Files in {selectedDirectory}</h2>
          <button onClick={handleFetchFiles}>Fetch Files</button>
          <p>Status: {filesStatus}</p>
          {filesStatus === "succeeded" && (
            <ul>
              {files.map((file) => (
                <li key={file.name}>
                  {file.name} {file.isDirectory ? "(Directory)" : "(File)"}
                </li>
              ))}
            </ul>
          )}
          {filesStatus === "failed" && <p>Error fetching files.</p>}
        </div>
      )}
    </div>
  )
}

export default App
