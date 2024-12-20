import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { pickDirectoryThunk, setSelectedDirectory } from "../../store/appSlice"
import { fetchFilesThunk, toggleFileSelection } from "../../store/fileSlice"

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
    <div>
      <h1 className="text-xl font-bold mb-4">Select a Directory</h1>
      <p>Selected Directory: {selectedDirectory ?? "None"}</p>
      <button
        className="px-4 py-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleSelectDirectory}
      >
        Choose a Directory
      </button>

      <div className="mt-8">
        <h1 className="text-xl font-bold mb-4">Files</h1>
        {selectedDirectory ? (
          <div>
            <button
              className="px-4 py-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleListFiles}
            >
              Refresh
            </button>
            {filesStatus === "succeeded" && (
              <ul className="list-none mt-2">
                {files.map((file) => (
                  <li
                    key={file.name}
                    className="flex items-center space-x-2 py-1"
                  >
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
