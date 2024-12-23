import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from "uuid"
import type { RootState } from "./store"

// Define the shape of a rename rule
export interface RenameRule {
  id: string
  type: "insert" | "replace" | "changeCase" | "truncate"
  options: {
    [key: string]: any
  }
}

interface PreviewResult {
  originalName: string
  newName: string
}

interface RenameState {
  rules: RenameRule[]
  selectedRuleId: string | null
  previewResult: PreviewResult[]
}

const initialState: RenameState = {
  rules: [],
  selectedRuleId: null,
  previewResult: [],
}

export const previewFilesThunk = createAsyncThunk<
  PreviewResult[], // success return type
  void, // no argument needed
  { state: RootState }
>("rename/previewFiles", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    const directory = state.app.selectedDirectory
    // Build up the list of selected files
    const selectedFiles = state.files.selectedFiles.map((filename) => ({
      name: filename,
      isDirectory: false,
    }))
    const rules = state.rename.rules

    if (!directory || selectedFiles.length === 0 || rules.length === 0) {
      // If there's no directory or no rules or no files, return empty
      return []
    }

    // IPC call to the Go "preview" binary
    // Make sure `window.api.runPreview` is exposed in `preload.ts`
    const payload = { directory, files: selectedFiles, rules }
    const result = await window.api.runPreview(payload)
    // result should be an array of { originalName, newName }
    return result
  } catch (err: any) {
    return rejectWithValue(err.message)
  }
})

// 2) Define the thunk for applying rename:
export const applyRenameThunk = createAsyncThunk<
  {
    originalName: string
    newName: string
    status: string
    errorMsg?: string
  }[], // rename results
  void,
  { state: RootState }
>("rename/applyRename", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    const directory = state.app.selectedDirectory
    const selectedFiles = state.files.selectedFiles.map((filename) => ({
      name: filename,
      isDirectory: false,
    }))
    const rules = state.rename.rules

    if (!directory || selectedFiles.length === 0 || rules.length === 0) {
      return []
    }

    const payload = { directory, files: selectedFiles, rules }
    const result = await window.api.runRename(payload)
    return result
  } catch (err: any) {
    return rejectWithValue(err.message)
  }
})

const renameSlice = createSlice({
  name: "rename",
  initialState,
  reducers: {
    addRule: (state, action: PayloadAction<Partial<RenameRule>>) => {
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
  extraReducers: (builder) => {
    builder
      // Handle preview
      .addCase(previewFilesThunk.fulfilled, (state, action) => {
        state.previewResult = action.payload
      })
      .addCase(previewFilesThunk.rejected, (state, action) => {
        // If you want, handle error
        state.previewResult = []
      })

      // Handle rename
      .addCase(applyRenameThunk.fulfilled, (state, action) => {
        // Optionally store the rename results or do nothing
      })
      .addCase(applyRenameThunk.rejected, (state, action) => {
        // handle error if needed
      })
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
