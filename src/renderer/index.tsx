import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { Provider } from "react-redux"
import { store } from "./store/store"
import "../styles/global.css"

const container = document.getElementById("root")
if (!container) {
  throw new Error("Root container missing in index.html")
}

const root = createRoot(container)
root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
