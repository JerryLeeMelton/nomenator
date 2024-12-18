import React, { useState } from "react"
import { useAppDispatch, useAppSelector } from "./store/hooks"
import type { RootState } from "./store/store"
import { setSelectedDirectory } from "./store/appSlice"
import { fetchFilesThunk } from "./store/fileSlice"
import { pickDirectoryThunk } from "./store/appSlice"
import { MainTabs } from "./components/MainTabs/MainTabs"
import { toggleFileSelection, clearSelectedFiles } from "./store/fileSlice"

const App: React.FC = () => {
  const dispatch = useAppDispatch()

  const tabs = ["choose", "rename"]
  const [activeTab, setActiveTab] = useState<string>("choose")

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

  return (
    <div className="h-full flex flex-col">
      {/* Top Half */}
      <div className="h-1/2 flex flex-col">
        <MainTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="flex-1 p-4 overflow-auto">
          {activeTab === "choose" && (
            <div>
              <h1 className="text-xl font-bold mb-4">Select a Directory</h1>
              <p>Selected Directory: {selectedDirectory ?? "None"}</p>
              <button
                className="px-4 py-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSelectDirectory}
              >
                Pick a Directory
              </button>
            </div>
          )}

          {activeTab === "choose" && (
            <div className="mt-8">
              <h1 className="text-xl font-bold mb-4">Files</h1>
              {selectedDirectory ? (
                <div>
                  <p>Current Directory: {selectedDirectory}</p>
                  <button
                    className="px-4 py-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleListFiles}
                  >
                    Fetch Files
                  </button>
                  <p className="mt-4">Status: {filesStatus}</p>
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
                <p>
                  No directory selected. Go to the Directory tab to select one.
                </p>
              )}
            </div>
          )}

          {activeTab === "rename" && (
            <div>
              <h1 className="text-xl font-bold mb-4">Rename Operations</h1>
              <p>
                This tab will be for configuring and previewing renaming rules.
              </p>
              {/* Future UI for rename operations goes here */}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Half: Selected Files Table */}
      <div className="h-1/2 overflow-auto border-t border-gray-300 p-4">
        <h2 className="text-lg font-bold mb-4">Selected Files</h2>
        {selectedFiles.length === 0 ? (
          <p>No files selected.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100">
                <th className="text-left p-2">Original Name</th>
                <th className="text-left p-2">New Name</th>
              </tr>
            </thead>
            <tbody>
              {selectedFiles.map((fileName) => (
                <tr key={fileName} className="border-b border-gray-200">
                  <td className="p-2">{fileName}</td>
                  {/* For now, just show the original name in New Name column as well.
                      Later we will apply rename logic here. */}
                  <td className="p-2 text-gray-600">{fileName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default App
