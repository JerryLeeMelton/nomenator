import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"

interface AppState {
  selectedDirectory: string | null
}

const initialState: AppState = {
  selectedDirectory: null,
}

// Thunk to pick a directory
export const pickDirectoryThunk = createAsyncThunk(
  "app/pickDirectory",
  async () => {
    const directory = await window.api.pickDirectory()
    return directory as string | null
  }
)

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSelectedDirectory(state, action: PayloadAction<string | null>) {
      state.selectedDirectory = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(pickDirectoryThunk.fulfilled, (state, action) => {
      state.selectedDirectory = action.payload
    })
  },
})

export const { setSelectedDirectory } = appSlice.actions
export default appSlice.reducer
