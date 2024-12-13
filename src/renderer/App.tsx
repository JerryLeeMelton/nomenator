import React from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "./store/store"
import { setSelectedDirectory } from "./store/appSlice"

const App: React.FC = () => {
  const dispatch = useDispatch()
  const selectedDirectory = useSelector(
    (state: RootState) => state.app.selectedDirectory
  )

  const handleSelectDirectory = () => {
    dispatch(setSelectedDirectory("/path/to/directory"))
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>
      <h1>Welcome to Nomenator</h1>
      <p>
        Selected Directory: {selectedDirectory ? selectedDirectory : "None"}
      </p>
      <button onClick={handleSelectDirectory}>Select Directory</button>
    </div>
  )
}

export default App
