import React from "react"
import { RenamePanel } from "../RenamePanel/RenamePanel"

export const RenameTab: React.FC = () => {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Rename Operations</h1>
      <RenamePanel />
    </div>
  )
}
