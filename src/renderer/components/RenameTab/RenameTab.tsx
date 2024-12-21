// src/renderer/components/RenameTab/RenameTab.tsx
import React from "react"
import "./RenameTab.css"
import { RenameRuleOptions } from "../RenamePanel/RenameRuleOptions"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { RenameSidebar } from "../RenameSidebar/RenameSidebar"

export const RenameTab: React.FC = () => {
  // We only need selectedRuleId here so we can pass it to <RenameRuleOptions />
  const selectedRuleId = useAppSelector(
    (state: RootState) => state.rename.selectedRuleId
  )

  return (
    <div className="rename-tab flex flex-row">
      {/* Left Pane: Sidebar */}
      <RenameSidebar />

      {/* Right Pane: Detailed Rule Options */}
      <div className="bg-blue-600 w-full min-h-16">
        <RenameRuleOptions renameRuleID={selectedRuleId} />
      </div>
    </div>
  )
}
