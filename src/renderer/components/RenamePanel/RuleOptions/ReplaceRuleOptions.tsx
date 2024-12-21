import React from "react"
import { RenameRule } from "../../../store/renameSlice"

interface ReplaceRuleOptionsProps {
  rule: RenameRule
  onChange: (field: string, value: any) => void
}

export const ReplaceRuleOptions: React.FC<ReplaceRuleOptionsProps> = ({
  rule,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-medium mb-1">Search</label>
        <input
          type="text"
          className="w-60 border border-gray-300 p-1 rounded"
          value={rule.options.search || ""}
          onChange={(e) => onChange("search", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Replace With</label>
        <input
          type="text"
          className="w-60 border border-gray-300 p-1 rounded"
          value={rule.options.replaceWith || ""}
          onChange={(e) => onChange("replaceWith", e.target.value)}
        />
      </div>
    </div>
  )
}
