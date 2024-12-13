import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AppState {
  selectedDirectory: string | null
}

const initialState: AppState = {
  selectedDirectory: null,
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSelectedDirectory(state, action: PayloadAction<string>) {
      state.selectedDirectory = action.payload
    },
  },
})

export const { setSelectedDirectory } = appSlice.actions
export default appSlice.reducer
