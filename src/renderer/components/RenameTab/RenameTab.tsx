import React, { useEffect } from "react"
import { RenameRuleOptions } from "../RenamePanel/RuleOptions/RenameRuleOptions"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { RenameSidebar } from "../RenameSidebar/RenameSidebar"
import { previewFilesThunk } from "../../store/renameSlice"

export const RenameTab: React.FC = () => {
  const dispatch = useAppDispatch()
  const { selectedRuleId, rules, previewResult } = useAppSelector(
    (state: RootState) => state.rename
  )

  // Fetch a new preview whenever the rules change
  useEffect(() => {
    dispatch(previewFilesThunk())
  }, [rules, dispatch])

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
