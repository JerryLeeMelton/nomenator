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
  selectedFiles: string[]
}

const initialState: FilesState = {
  items: [],
  status: "idle",
  error: null,
  selectedFiles: [],
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
  reducers: {
    toggleFileSelection: (state, action: PayloadAction<string>) => {
      const fileName = action.payload
      if (state.selectedFiles.includes(fileName)) {
        state.selectedFiles = state.selectedFiles.filter(
          (file) => file !== fileName
        )
      } else {
        state.selectedFiles.push(fileName)
      }
    },
    clearSelectedFiles: (state) => {
      state.selectedFiles = []
    },
  },
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
          state.selectedFiles = []
        }
      )
      .addCase(fetchFilesThunk.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? "An error occurred"
      })
  },
})

export const { toggleFileSelection, clearSelectedFiles } = filesSlice.actions
export default filesSlice.reducer
