// src/renderer/components/RenamePanel/RuleOptions/RenameRuleOptions.tsx
import React from "react"
import { useAppSelector, useAppDispatch } from "../../../store/hooks"
import { RootState } from "../../../store/store"
import { RenameRule, updateRule } from "../../../store/renameSlice"

// Import each specialized sub-component
import { InsertRuleOptions } from "./InsertRuleOptions"
import { ReplaceRuleOptions } from "./ReplaceRuleOptions"
import { ChangeCaseRuleOptions } from "./ChangeCaseRuleOptions"
import { TruncateRuleOptions } from "./TruncateRuleOptions"

interface RenameRuleOptionsProps {
  renameRuleID: string | null
}

export const RenameRuleOptions: React.FC<RenameRuleOptionsProps> = ({
  renameRuleID,
}) => {
  const dispatch = useAppDispatch()

  // Find the selected rule
  const rule = useAppSelector((state: RootState) =>
    state.rename.rules.find((r) => r.id === renameRuleID)
  )

  // If no valid rule, show a placeholder
  if (!rule) {
    return <div className="text-gray-500 italic">No rule selected.</div>
  }

  // Generic handler to update the rule in Redux
  const handleOptionChange = (field: string, value: any) => {
    const updatedRule: RenameRule = {
      ...rule,
      options: {
        ...rule.options,
        [field]: value,
      },
    }
    dispatch(updateRule(updatedRule))
  }

  // Render the sub-component based on `rule.type`
  let ruleEditor: React.ReactNode
  switch (rule.type) {
    case "insert":
      ruleEditor = (
        <InsertRuleOptions rule={rule} onChange={handleOptionChange} />
      )
      break
    case "replace":
      ruleEditor = (
        <ReplaceRuleOptions rule={rule} onChange={handleOptionChange} />
      )
      break
    case "changeCase":
      ruleEditor = (
        <ChangeCaseRuleOptions rule={rule} onChange={handleOptionChange} />
      )
      break
    case "truncate":
      ruleEditor = (
        <TruncateRuleOptions rule={rule} onChange={handleOptionChange} />
      )
      break
    default:
      ruleEditor = <div>Unknown rule type: {rule.type}</div>
  }

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Configure Rule: {rule.type}</div>
      {ruleEditor}
    </div>
  )
}
