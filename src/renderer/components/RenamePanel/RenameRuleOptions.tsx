import React from "react"
import { RenameRule } from "../../store/renameSlice"

interface RenameRuleOptionsProps {
  renameRuleID: string | null
}

export const RenameRuleOptions: React.FC<RenameRuleOptionsProps> = ({
  renameRuleID,
}) => {
  return <div>Rename Rule ID: {renameRuleID}</div>
}
