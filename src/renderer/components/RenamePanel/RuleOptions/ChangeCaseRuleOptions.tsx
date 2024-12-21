import React from "react"
import { RenameRule } from "../../../store/renameSlice"

interface ChangeCaseRuleOptionsProps {
  rule: RenameRule
  onChange: (field: string, value: any) => void
}

export const ChangeCaseRuleOptions: React.FC<ChangeCaseRuleOptionsProps> = ({
  rule,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Case Type</label>
      <select
        className="border border-gray-300 p-1 rounded"
        value={rule.options.caseType || "upper"}
        onChange={(e) => onChange("caseType", e.target.value)}
      >
        <option value="upper">UPPERCASE</option>
        <option value="lower">lowercase</option>
        <option value="title">Title Case</option>
      </select>
    </div>
  )
}
