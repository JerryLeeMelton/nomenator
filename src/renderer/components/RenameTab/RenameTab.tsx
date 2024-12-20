import React, { useEffect, useState } from "react"
import { RenamePanel } from "../RenamePanel/RenamePanel"
import { useAppDispatch } from "../../store/hooks"
import { addRule } from "../../store/renameSlice"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { v4 as uuidv4 } from "uuid"
import { RuleCard } from "../RenamePanel/RuleCard"
import "./RenameTab.css"
import { RenameRuleOptions } from "../RenamePanel/RenameRuleOptions"

export const RenameTab: React.FC = () => {
  const dispatch = useAppDispatch()
  const rules = useAppSelector((state: RootState) => state.rename.rules)
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null)

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

  useEffect(() => {
    console.log("rules == ", rules)
  }, [rules])

  const handleSelectRule = (ruleId: string) => {
    setSelectedRuleId(ruleId)
  }

  return (
    <div className="rename-tab flex flex-row">
      <div className="bg-red-600 min-w-24 min-h-16">
        <div className="rename-operations-picker-container">
          <button className="rename-operations-picker-button">
            <span
              className="rename-operations-picker-button-text"
              onClick={handleAddRule}
            >
              Add An Operation
            </span>
          </button>
        </div>
        <div className="rename-operations-list-container">
          {rules.map((rule) => (
            <div
              className={`rename-operations-list-item ${
                selectedRuleId === rule.id ? "selected-rule" : ""
              }`}
              key={rule.id}
              onClick={() => {
                handleSelectRule(rule.id)
              }}
            >
              {rule.id}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-600 w-full min-h-16">
        <RenameRuleOptions renameRuleID={selectedRuleId} />
      </div>
    </div>
  )
}
