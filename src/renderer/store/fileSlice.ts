import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"

interface FilesState {
  items: string[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: FilesState = {
  items: [],
  status: "idle",
  error: null,
}

export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async (directory: string) => {
    // This is a placeholder for the actual logic.
    // Later, we'll call Electron main process (via IPC)
    // or Go backend to get directory contents.

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Return mock file list
    return ["file1.txt", "file2.txt", "file3.txt"]
  }
)

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(
        fetchFiles.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.status = "succeeded"
          state.items = action.payload
        }
      )
      .addCase(fetchFiles.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? "An error occurred"
      })
  },
})

export default filesSlice.reducer
