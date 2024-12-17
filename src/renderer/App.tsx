import React, { useState } from "react"
import { useAppDispatch, useAppSelector } from "./store/hooks"
import type { RootState } from "./store/store"
import { setSelectedDirectory } from "./store/appSlice"
import { fetchFilesThunk } from "./store/fileSlice"
import { pickDirectoryThunk } from "./store/appSlice"
import { MainTabs } from "./components/MainTabs"

const App: React.FC = () => {
  const dispatch = useAppDispatch()

  const tabs = ["choose", "rename"]

  const [activeTab, setActiveTab] = useState<string>("choose")

  const selectedDirectory = useAppSelector(
    (state: RootState) => state.app.selectedDirectory
  )
  const files = useAppSelector((state: RootState) => state.files.items)
  const filesStatus = useAppSelector((state: RootState) => state.files.status)

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

  return (
    <div className="w-full h-full flex flex-col">
      {/* Top Section: Tabs */}
      <MainTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
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
          <div>
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
                  <ul className="list-disc ml-6 mt-2">
                    {files.map((file) => (
                      <li key={file.name}>
                        {file.name}{" "}
                        {file.isDirectory ? "(Directory)" : "(File)"}
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
  )

  return (
    <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>
      <h1>Welcome to Nomenator</h1>
      <p>Selected Directory: {selectedDirectory ?? "None"}</p>
      <button onClick={handleSelectDirectory}>Pick a Directory</button>

      {selectedDirectory && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Files in {selectedDirectory}</h2>
          <button onClick={handleListFiles}>Fetch Files</button>
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
