import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"

export interface FileItem {
  name: string
  isDirectory: boolean
}

interface FilesState {
  items: FileItem[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: FilesState = {
  items: [],
  status: "idle",
  error: null,
}

export const fetchFilesThunk = createAsyncThunk(
  "files/fetchFiles",
  async (directory: string) => {
    const files = await window.api.listFiles(directory)
    return files
  }
)

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilesThunk.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(
        fetchFilesThunk.fulfilled,
        (state, action: PayloadAction<FileItem[]>) => {
          state.status = "succeeded"
          state.items = action.payload
        }
      )
      .addCase(fetchFilesThunk.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? "An error occurred"
      })
  },
})

export default filesSlice.reducer
