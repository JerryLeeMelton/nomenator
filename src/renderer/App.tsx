import React, { useState } from "react"
import { useAppDispatch, useAppSelector } from "./store/hooks"
import type { RootState } from "./store/store"
import { setSelectedDirectory } from "./store/appSlice"
import { fetchFilesThunk } from "./store/fileSlice"
import { pickDirectoryThunk } from "./store/appSlice"
import { toggleFileSelection, clearSelectedFiles } from "./store/fileSlice"
import { MainTabs } from "./components/MainTabs/MainTabs"
import { ChooseTab } from "./components/ChooseTab/ChooseTab"
import { RenameTab } from "./components/RenameTab/RenameTab"
import { SelectedFilesTable } from "./components/SelectedFilesTable/SelectedFilesTable"
import { TitleBar } from "./components/TitleBar/TitleBar"

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
    <div className="main-window-container h-full flex flex-col">
      <TitleBar />
      {/* Top Half */}
      <div className="flex flex-col main-window-content-top">
        <MainTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="flex-1 p-4 overflow-auto main-controls-container">
          {activeTab === "choose" && <ChooseTab />}
          {activeTab === "rename" && <RenameTab />}
        </div>
      </div>

      {/* Bottom Half: Selected Files Table */}
      <div className="overflow-auto border-t border-gray-300 p-4 main-window-content-bottom">
        <SelectedFilesTable />
      </div>
    </div>
  )
}

export default App
