import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from "uuid"

// Define the shape of a rename rule
export interface RenameRule {
  id: string
  type: "insert" | "replace" | "changeCase" | "truncate"
  options: {
    [key: string]: any
    // This could be more strictly typed based on the type of rule.
    // For simplicity, it's any for now. We might refine this later.
  }
}

interface RenameState {
  rules: RenameRule[]
  selectedRuleId: string | null
}

const initialState: RenameState = {
  rules: [],
  selectedRuleId: null,
}

const renameSlice = createSlice({
  name: "rename",
  initialState,
  reducers: {
    addRule: (state, action: PayloadAction<Partial<RenameRule>>) => {
      // Provide a default ID if not supplied.
      const newRule: RenameRule = {
        id: action.payload.id || uuidv4(),
        type: action.payload.type || "insert",
        options: action.payload.options || {},
      }
      state.rules.push(newRule)
    },

    removeRule: (state, action: PayloadAction<string>) => {
      state.rules = state.rules.filter((rule) => rule.id !== action.payload)
    },

    updateRule: (state, action: PayloadAction<RenameRule>) => {
      const index = state.rules.findIndex((r) => r.id === action.payload.id)
      if (index > -1) {
        state.rules[index] = action.payload
      }
    },

    reorderRules: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload
      if (fromIndex < 0 || fromIndex >= state.rules.length) return
      if (toIndex < 0 || toIndex >= state.rules.length) return

      const [movedRule] = state.rules.splice(fromIndex, 1)
      state.rules.splice(toIndex, 0, movedRule)
    },

    clearRules: (state) => {
      state.rules = []
    },

    setSelectedRuleId: (state, action: PayloadAction<string | null>) => {
      state.selectedRuleId = action.payload
    },
  },
})

export const {
  addRule,
  removeRule,
  updateRule,
  reorderRules,
  clearRules,
  setSelectedRuleId,
} = renameSlice.actions

export default renameSlice.reducer
