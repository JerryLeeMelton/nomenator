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
  applyRenameThunk,
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

  const handleApplyRename = () => {
    dispatch(applyRenameThunk())
      .unwrap()
      .then((results) => {
        console.log("Rename results: ", results)
        // Optionally re-fetch file list or show success UI
      })
      .catch((err) => {
        console.error("Rename error: ", err)
      })
  }

  return (
    <div className="flex flex-col h-full p-4">
      {/* Dropdown for adding a rename operation */}
      <div className="mb-4">
        <RenameOperationsMenu
          width={200}
          height={40}
          headerLabel="Add Rename Operation"
          optionsList={renameOperations}
          onSelect={handleSelectOperation}
          disabled={false}
        />
      </div>

      {/* Rules List */}
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {rules.map((rule) => {
            const isSelected = rule.id === selectedRuleId
            return (
              <li
                key={rule.id}
                onClick={() => handleSelectRule(rule.id)}
                className={`rename-rule-item cursor-pointer px-2 py-1 rounded 
                  ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200 bg-gray-100 text-gray-800"
                  }
                `}
              >
                {rule.type.toUpperCase()}
                {/* / ID: {rule.id} */}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Reorder & Delete Buttons */}
      <div className="mt-4 flex items-center space-x-2">
        <button
          onClick={() => handleReorderRules("up")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded transition-colors"
        >
          <Icon path={mdiChevronUp} size={0.8} />
        </button>
        <button
          onClick={() => handleReorderRules("down")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded transition-colors"
        >
          <Icon path={mdiChevronDown} size={0.8} />
        </button>
        <button
          onClick={handleDeleteRule}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors ml-auto"
        >
          Delete
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded mt-4"
          onClick={handleApplyRename}
        >
          Apply Rename
        </button>
      </div>
    </div>
  )
}
