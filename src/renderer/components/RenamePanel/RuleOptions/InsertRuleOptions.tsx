import React from "react"
import { RenameRule } from "../../../store/renameSlice"

interface InsertRuleOptionsProps {
  rule: RenameRule
  onChange: (field: string, value: any) => void
}

export const InsertRuleOptions: React.FC<InsertRuleOptionsProps> = ({
  rule,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-medium mb-1">Text to Insert</label>
        <input
          type="text"
          className="w-60 border border-gray-300 p-1 rounded"
          value={rule.options.text || ""}
          onChange={(e) => onChange("text", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Position</label>
        <input
          type="number"
          className="w-20 border border-gray-300 p-1 rounded"
          value={rule.options.position || 0}
          onChange={(e) => onChange("position", Number(e.target.value))}
        />
      </div>
    </div>
  )
}
