import React from "react"
import {
  mdiWindowMinimize,
  mdiWindowMaximize,
  mdiClose,
  mdiWindowRestore,
} from "@mdi/js"
import Icon from "@mdi/react"
import "./TitleBar.css"

export const TitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = React.useState(false)

  const minimizeWindow = () => {
    window.api?.minimizeWindow()
  }

  const toggleMaximizeWindow = async () => {
    await window.api?.toggleMaximizeWindow()
    // After toggling, you might want to check if window is actually maximized.
    // You could implement ipc calls to check state, or just toggle the UI state optimistically.
    setIsMaximized((prev) => !prev)
  }

  const closeWindow = () => {
    window.api?.closeWindow()
  }

  return (
    <header className="title-bar w-full h-10 flex items-center justify-between text-white select-none">
      {/* App Logo and Title */}
      <div className="flex items-center pl-3">
        <span className="font-bold text-lg tracking-wide">Nomenator</span>
      </div>

      {/* Window Controls */}
      <div className="title-bar-controls-container flex">
        <button
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-700"
          onClick={minimizeWindow}
        >
          <Icon path={mdiWindowMinimize} size={0.8} />
        </button>
        <button
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-700"
          onClick={toggleMaximizeWindow}
        >
          <Icon
            path={isMaximized ? mdiWindowRestore : mdiWindowMaximize}
            size={0.8}
          />
        </button>
        <button
          className="title-bar-close-button w-10 h-10 flex items-center justify-center"
          onClick={closeWindow}
        >
          <Icon path={mdiClose} size={0.8} />
        </button>
      </div>
    </header>
  )
}
