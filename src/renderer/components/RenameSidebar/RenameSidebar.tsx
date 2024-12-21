// src/renderer/components/RenameTab/RenameSidebar.tsx
import React, { useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"

import {
  addRule,
  removeRule,
  reorderRules,
  setSelectedRuleId,
  RenameRule,
} from "../../store/renameSlice"

import { mdiChevronUp, mdiChevronDown } from "@mdi/js"
import Icon from "@mdi/react"

import {
  RenameOperationsMenu,
  RenameOperationMenuOption,
} from "../UIComponents/RenameOperationsMenu/RenameOperationsMenu"

interface RenameSidebarProps {}

export const RenameSidebar: React.FC<RenameSidebarProps> = () => {
  const dispatch = useAppDispatch()
  const rules = useAppSelector((state: RootState) => state.rename.rules)
  const selectedRuleId = useAppSelector(
    (state: RootState) => state.rename.selectedRuleId
  )

  // List of operations in the dropdown
  const renameOperations: RenameOperationMenuOption[] = [
    { key: "insert", label: "Insert" },
    { key: "replace", label: "Replace" },
    { key: "changeCase", label: "Change Case" },
    { key: "truncate", label: "Truncate" },
  ]

  /** Handler for selecting an operation from the dropdown. */
  const handleSelectOperation = useCallback(
    (option: RenameOperationMenuOption) => {
      const newRule: RenameRule = {
        id: uuidv4(),
        type: option.key as "insert" | "replace" | "changeCase" | "truncate",
        options: {},
      }
      dispatch(addRule(newRule))
      dispatch(setSelectedRuleId(newRule.id))
    },
    [dispatch]
  )

  /** If you still want a separate addRule button, keep this or remove it if not needed. */
  const handleAddRule = useCallback(() => {
    const newRule: RenameRule = {
      id: uuidv4(),
      type: "insert",
      options: { text: "", position: 0 },
    }
    dispatch(addRule(newRule))
    dispatch(setSelectedRuleId(newRule.id))
  }, [dispatch])

  /** Reorder up/down logic. */
  const handleReorderRules = useCallback(
    (direction: "up" | "down") => {
      if (!selectedRuleId) return
      const fromIndex = rules.findIndex((rule) => rule.id === selectedRuleId)
      const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1

      dispatch(
        reorderRules({
          fromIndex,
          toIndex,
        })
      )
    },
    [dispatch, rules, selectedRuleId]
  )

  /** Select a rule from the sidebar list. */
  const handleSelectRule = useCallback(
    (ruleId: string) => {
      dispatch(setSelectedRuleId(ruleId))
    },
    [dispatch]
  )

  /** Delete the currently selected rule and pick a new one (if available). */
  const handleDeleteRule = useCallback(() => {
    if (!selectedRuleId) return

    const index = rules.findIndex((rule) => rule.id === selectedRuleId)
    const total = rules.length

    let newSelectedRuleId: string | null = null

    // Decide which rule to select next, if any
    if (total > 1) {
      if (index === 0) {
        newSelectedRuleId = rules[1].id
      } else if (index === total - 1) {
        newSelectedRuleId = rules[index - 1].id
      } else {
        newSelectedRuleId = rules[index + 1].id
      }
    }

    dispatch(removeRule(selectedRuleId))
    dispatch(setSelectedRuleId(newSelectedRuleId))
  }, [dispatch, rules, selectedRuleId])

  return (
    <div className="bg-red-600 min-w-24 min-h-16">
      {/* A dropdown for adding an operation */}
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

      {/* List of added rename operations */}
      <div className="rename-operations-list-container">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`rename-operations-list-item ${
              selectedRuleId === rule.id ? "selected-rule" : ""
            }`}
            onClick={() => handleSelectRule(rule.id)}
          >
            {rule.id}
          </div>
        ))}
      </div>

      {/* Reorder Buttons */}
      <div className="rename-rule-reorder-container flex flex-row">
        <button
          className="rename-rule-reorder-button flex flex-row"
          onClick={() => handleReorderRules("down")}
        >
          <Icon path={mdiChevronDown} size={1} />
        </button>
        <button
          className="rename-rule-reorder-button flex flex-row"
          onClick={() => handleReorderRules("up")}
        >
          <Icon path={mdiChevronUp} size={1} />
        </button>
      </div>

      {/* Delete Button */}
      <div className="rename-rule-delete-container">
        <button
          className="rename-rule-delete-button"
          onClick={handleDeleteRule}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
