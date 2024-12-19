import React from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import {
  addRule,
  removeRule,
  updateRule,
  reorderRules,
} from "../../store/renameSlice"
import { RuleCard } from "./RuleCard"
import { v4 as uuidv4 } from "uuid"

export const RenamePanel: React.FC = () => {
  const dispatch = useAppDispatch()
  const rules = useAppSelector((state: RootState) => state.rename.rules)

  const handleAddRule = () => {
    // Add a default rule, e.g., an "insert" rule
    dispatch(
      addRule({
        id: uuidv4(),
        type: "insert",
        options: { text: "", position: 0 },
      })
    )
  }

  const handleUpdateRule = (updatedRule: any) => {
    dispatch(updateRule(updatedRule))
  }

  const handleRemoveRule = (ruleId: string) => {
    dispatch(removeRule(ruleId))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Rules</h2>
        <button
          onClick={handleAddRule}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Rule
        </button>
      </div>

      <div className="space-y-2">
        {rules.map((rule) => (
          <RuleCard
            key={rule.id}
            rule={rule}
            onRemove={handleRemoveRule}
            onUpdate={handleUpdateRule}
          />
        ))}
      </div>
    </div>
  )
}
