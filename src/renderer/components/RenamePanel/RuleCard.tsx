import React from "react"
import { RenameRule } from "../../store/renameSlice"

interface RuleCardProps {
  rule: RenameRule
  onUpdate: (rule: RenameRule) => void
  onRemove: (ruleId: string) => void
}

export const RuleCard: React.FC<RuleCardProps> = ({
  rule,
  onUpdate,
  onRemove,
}) => {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as RenameRule["type"]
    let newOptions = {}
    // Reset options based on the rule type selected
    if (newType === "insert") {
      newOptions = { text: "", position: 0 }
    } else if (newType === "replace") {
      newOptions = { search: "", replaceWith: "" }
    } else if (newType === "changeCase") {
      newOptions = { caseType: "upper" } // default case: upper
    } else if (newType === "truncate") {
      newOptions = { length: 10, from: "end" }
    }

    onUpdate({ ...rule, type: newType, options: newOptions })
  }

  const handleOptionChange = (field: string, value: any) => {
    onUpdate({ ...rule, options: { ...rule.options, [field]: value } })
  }

  const renderOptionsFields = () => {
    switch (rule.type) {
      case "insert":
        return (
          <div className="space-x-2">
            <input
              className="border px-2 py-1"
              type="text"
              placeholder="Text to insert"
              value={rule.options.text || ""}
              onChange={(e) => handleOptionChange("text", e.target.value)}
            />
            <input
              className="border px-2 py-1 w-16"
              type="number"
              placeholder="Position"
              value={rule.options.position || 0}
              onChange={(e) =>
                handleOptionChange("position", Number(e.target.value))
              }
            />
          </div>
        )
      case "replace":
        return (
          <div className="space-x-2">
            <input
              className="border px-2 py-1"
              type="text"
              placeholder="Search"
              value={rule.options.search || ""}
              onChange={(e) => handleOptionChange("search", e.target.value)}
            />
            <input
              className="border px-2 py-1"
              type="text"
              placeholder="Replace With"
              value={rule.options.replaceWith || ""}
              onChange={(e) =>
                handleOptionChange("replaceWith", e.target.value)
              }
            />
          </div>
        )
      case "changeCase":
        return (
          <div className="space-x-2">
            <select
              className="border px-2 py-1"
              value={rule.options.caseType || "upper"}
              onChange={(e) => handleOptionChange("caseType", e.target.value)}
            >
              <option value="upper">UPPERCASE</option>
              <option value="lower">lowercase</option>
              <option value="title">Title Case</option>
            </select>
          </div>
        )
      case "truncate":
        return (
          <div className="space-x-2">
            <input
              className="border px-2 py-1 w-16"
              type="number"
              placeholder="Length"
              value={rule.options.length || 10}
              onChange={(e) =>
                handleOptionChange("length", Number(e.target.value))
              }
            />
            <select
              className="border px-2 py-1"
              value={rule.options.from || "end"}
              onChange={(e) => handleOptionChange("from", e.target.value)}
            >
              <option value="start">From Start</option>
              <option value="end">From End</option>
            </select>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-3 border border-gray-300 rounded flex items-center space-x-4">
      <select
        className="border px-2 py-1"
        value={rule.type}
        onChange={handleTypeChange}
      >
        <option value="insert">Insert</option>
        <option value="replace">Replace</option>
        <option value="changeCase">Change Case</option>
        <option value="truncate">Truncate</option>
      </select>

      {renderOptionsFields()}

      <button
        className="ml-auto px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() => onRemove(rule.id)}
      >
        Remove
      </button>
    </div>
  )
}
