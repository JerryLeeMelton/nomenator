import { configureStore } from "@reduxjs/toolkit"
import appReducer from "./appSlice"
import filesReducer from "./fileSlice"
import renameReducer from "./renameSlice"

export const store = configureStore({
  reducer: {
    app: appReducer,
    files: filesReducer,
    rename: renameReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
