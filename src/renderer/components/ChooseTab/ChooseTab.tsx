import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { pickDirectoryThunk, setSelectedDirectory } from "../../store/appSlice"
import { fetchFilesThunk, toggleFileSelection } from "../../store/fileSlice"
import "./ChooseTab.css"

export const ChooseTab: React.FC = () => {
  const dispatch = useAppDispatch()

  const selectedDirectory = useAppSelector(
    (state: RootState) => state.app.selectedDirectory
  )
  const files = useAppSelector((state: RootState) => state.files.items)
  const filesStatus = useAppSelector((state: RootState) => state.files.status)
  const selectedFiles = useAppSelector(
    (state: RootState) => state.files.selectedFiles
  )

  const handleSelectDirectory = () => {
    dispatch(pickDirectoryThunk())
  }

  const handleListFiles = () => {
    if (selectedDirectory) {
      dispatch(fetchFilesThunk(selectedDirectory))
    } else {
      alert("Please select a directory first!")
    }
  }

  const handleFileClick = (fileName: string) => {
    dispatch(toggleFileSelection(fileName))
  }

  useEffect(() => {
    if (selectedDirectory) {
      dispatch(fetchFilesThunk(selectedDirectory))
    }
  }, [selectedDirectory, dispatch])

  return (
    <div className="choose-tab-container">
      {/* <h1 className="text-base font-bold mb-4">Directory:</h1> */}
      <div className="directory-controls-container flex flex-row">
        <button className="button-primary" onClick={handleSelectDirectory}>
          Browse
        </button>

        <div className="selected-directory-container flex flex-row">
          <p
            className={
              selectedDirectory == null
                ? "flex items-center no-directory-selected"
                : "flex items-center"
            }
          >
            {selectedDirectory ?? "No directory selected"}
          </p>
        </div>

        <button
          className="button-primary"
          onClick={handleListFiles}
          disabled={selectedDirectory === null}
        >
          Refresh
        </button>
      </div>

      <div className="file-list-outer-container">
        {/* <h1 className="text-xl font-bold mb-4">Files</h1> */}
        {selectedDirectory ? (
          <div className="file-list-container">
            {filesStatus === "succeeded" && (
              <ul className="list-none">
                {files.map((file) => (
                  <li key={file.name} className="file-list-item">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.name)}
                      onChange={() => handleFileClick(file.name)}
                    />
                    <span>{file.name}</span>
                    <span className="text-gray-600">
                      {file.isDirectory ? "(Directory)" : "(File)"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {filesStatus === "failed" && (
              <p className="text-red-500">Error fetching files.</p>
            )}
          </div>
        ) : (
          <p>No directory selected. Please select one above.</p>
        )}
      </div>
    </div>
  )
}
