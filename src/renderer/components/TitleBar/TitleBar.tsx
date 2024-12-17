import React from "react"
import {
  mdiWindowMinimize,
  mdiWindowMaximize,
  mdiClose,
  mdiWindowRestore,
} from "@mdi/js"
import Icon from "@mdi/react"

export const TitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = React.useState(false)

  // Event Handlers
  // const minimizeWindow = () => window.api?.minimizeWindow()
  // const toggleMaximizeWindow = () => {
  //   window.api?.toggleMaximizeWindow()
  //   setIsMaximized((prev) => !prev)
  // }
  // const closeWindow = () => window.api?.closeWindow()

  // Dummy Event Handlers
  const minimizeWindow = () => console.log("TitleBar.tsx  :  minimizeWindow")
  const toggleMaximizeWindow = () =>
    console.log("TitleBar.tsx  :  toggleMaximizeWindow")
  const closeWindow = () => console.log("TitleBar.tsx  :  closeWindow")

  return (
    <header className="w-full h-10 flex items-center justify-between bg-gray-800 text-white select-none">
      {/* App Logo and Title */}
      <div className="flex items-center pl-3">
        <span className="font-bold text-lg tracking-wide">Nomenator</span>
      </div>

      {/* Window Controls */}
      <div className="flex">
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
          className="w-10 h-10 flex items-center justify-center hover:bg-red-600"
          onClick={closeWindow}
        >
          <Icon path={mdiClose} size={0.8} />
        </button>
      </div>
    </header>
  )
}
