import React, { useEffect, useState } from "react"
import { RenamePanel } from "../RenamePanel/RenamePanel"
import { useAppDispatch } from "../../store/hooks"
import {
  addRule,
  RenameRule,
  setSelectedRuleId,
  reorderRules,
  removeRule,
} from "../../store/renameSlice"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { v4 as uuidv4 } from "uuid"
import { RuleCard } from "../RenamePanel/RuleCard"
import "./RenameTab.css"
import { RenameRuleOptions } from "../RenamePanel/RenameRuleOptions"
import { mdiChevronUp, mdiChevronDown } from "@mdi/js"
import Icon from "@mdi/react"
import {
  RenameOperationsMenu,
  RenameOperationMenuOption,
} from "../UIComponents/RenameOperationsMenu/RenameOperationsMenu"

export const RenameTab: React.FC = () => {
  const dispatch = useAppDispatch()
  const rules = useAppSelector((state: RootState) => state.rename.rules)
  const selectedRuleId = useAppSelector(
    (state: RootState) => state.rename.selectedRuleId
  )

  const renameOperations: RenameOperationMenuOption[] = [
    { key: "insert", label: "Insert" },
    { key: "replace", label: "Replace" },
    { key: "changeCase", label: "Change Case" },
    { key: "truncate", label: "Truncate" },
  ]

  const handleSelectOperation = (option: RenameOperationMenuOption) => {
    const newRule: RenameRule = {
      id: uuidv4(),
      type: option.key as "insert" | "replace" | "changeCase" | "truncate",
      options: {},
    }
    dispatch(addRule(newRule))
    dispatch(setSelectedRuleId(newRule.id))
  }

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

  const handleDeleteRule = (ruleId: string | null) => {
    if (ruleId === null) return

    let newSelectedRuleId = null
    const index = rules.findIndex((rule) => rule.id === ruleId)

    if (rules.length === 1) {
      newSelectedRuleId = null
    } else if (index === 0) {
      newSelectedRuleId = rules[1].id
    } else if (index === rules.length - 1) {
      newSelectedRuleId = rules[index - 1].id
    } else {
      newSelectedRuleId = rules[index + 1].id
    }

    dispatch(removeRule(ruleId))
    dispatch(setSelectedRuleId(newSelectedRuleId))
  }

  return (
    <div className="rename-tab flex flex-row">
      <div className="bg-red-600 min-w-24 min-h-16">
        <div className="rename-operations-picker-container">
          <RenameOperationsMenu
            width={200}
            height={40}
            headerLabel="Add Rename Operation"
            optionsList={renameOperations}
            onSelect={handleSelectOperation}
            disabled={false}
          />
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
        <div className="rename-rule-delete-container">
          <button
            className="rename-rule-delete-button"
            onClick={() => {
              handleDeleteRule(selectedRuleId)
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-blue-600 w-full min-h-16">
        <RenameRuleOptions renameRuleID={selectedRuleId} />
      </div>
    </div>
  )
}
