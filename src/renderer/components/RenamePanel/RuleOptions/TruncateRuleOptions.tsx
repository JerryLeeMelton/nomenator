import React from "react"
import { RenameRule } from "../../../store/renameSlice"

interface TruncateRuleOptionsProps {
  rule: RenameRule
  onChange: (field: string, value: any) => void
}

export const TruncateRuleOptions: React.FC<TruncateRuleOptionsProps> = ({
  rule,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-medium mb-1">Length</label>
        <input
          type="number"
          className="w-20 border border-gray-300 p-1 rounded"
          value={rule.options.length || 10}
          onChange={(e) => onChange("length", Number(e.target.value))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">From</label>
        <select
          className="border border-gray-300 p-1 rounded"
          value={rule.options.from || "end"}
          onChange={(e) => onChange("from", e.target.value)}
        >
          <option value="start">Start</option>
          <option value="end">End</option>
        </select>
      </div>
    </div>
  )
}
