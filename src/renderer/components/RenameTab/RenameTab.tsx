// src/renderer/components/RenameTab/RenameTab.tsx
import React from "react"
import { RenameRuleOptions } from "../RenamePanel/RuleOptions/RenameRuleOptions"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { RenameSidebar } from "../RenameSidebar/RenameSidebar"

export const RenameTab: React.FC = () => {
  // We only need selectedRuleId here so we can pass it to <RenameRuleOptions />
  const selectedRuleId = useAppSelector(
    (state: RootState) => state.rename.selectedRuleId
  )

  return (
    <div className="flex w-full h-full">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-100 border-r border-gray-300">
        <RenameSidebar />
      </div>

      {/* Main Rename Options Area (Right) */}
      <div className="flex-1 bg-white p-4">
        <RenameRuleOptions renameRuleID={selectedRuleId} />
      </div>
    </div>
  )
}
