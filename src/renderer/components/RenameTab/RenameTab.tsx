import React, { useEffect, useState } from "react"
import { RenamePanel } from "../RenamePanel/RenamePanel"
import { useAppDispatch } from "../../store/hooks"
import {
  addRule,
  RenameRule,
  setSelectedRuleId,
  reorderRules,
} from "../../store/renameSlice"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { v4 as uuidv4 } from "uuid"
import { RuleCard } from "../RenamePanel/RuleCard"
import "./RenameTab.css"
import { RenameRuleOptions } from "../RenamePanel/RenameRuleOptions"
import { mdiChevronUp, mdiChevronDown } from "@mdi/js"
import Icon from "@mdi/react"

export const RenameTab: React.FC = () => {
  const dispatch = useAppDispatch()
  const rules = useAppSelector((state: RootState) => state.rename.rules)
  const selectedRuleId = useAppSelector(
    (state: RootState) => state.rename.selectedRuleId
  )

  const handleAddRule = () => {
    // Add a default rule, e.g., an "insert" rule
    const newRule: RenameRule = {
      id: uuidv4(),
      type: "insert",
      options: { text: "", position: 0 },
    }
    dispatch(addRule(newRule))
    dispatch(setSelectedRuleId(newRule.id))
  }

  const handleReorderRules = (
    selectedRuleID: string | null,
    direction: "up" | "down"
  ) => {
    if (selectedRuleID === null) return
    const fromIndex = rules.findIndex((rule) => rule.id === selectedRuleID)
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1

    dispatch(
      reorderRules({
        fromIndex,
        toIndex,
      })
    )
  }

  useEffect(() => {
    console.log("rules == ", rules)
  }, [rules])

  const handleSelectRule = (ruleId: string) => {
    dispatch(setSelectedRuleId(ruleId))
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
        <div className="rename-rule-reorder-container flex flex-row">
          <button
            className="rename-rule-reorder-button flex flex-row"
            onClick={() => {
              handleReorderRules(selectedRuleId, "down")
            }}
          >
            <span className="material-icons">
              <Icon path={mdiChevronDown} size={1} />
            </span>
          </button>
          <button
            className="rename-rule-reorder-button flex flex-row"
            onClick={() => {
              handleReorderRules(selectedRuleId, "up")
            }}
          >
            <span className="material-icons">
              <Icon path={mdiChevronUp} size={1} />
            </span>
          </button>
        </div>
      </div>

      <div className="bg-blue-600 w-full min-h-16">
        <RenameRuleOptions renameRuleID={selectedRuleId} />
      </div>
    </div>
  )
}
