import { configureStore } from "@reduxjs/toolkit"
import appReducer from "./appSlice"
import filesReducer from "./fileSlice"

export const store = configureStore({
  reducer: {
    app: appReducer,
    files: filesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
