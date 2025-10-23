import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
// import { FormProvider } from "../../react-power-form/src/index.tsx"

const root = document.getElementById("root")
if (root) {
  createRoot(root).render(
    <StrictMode>
      {/* <FormProvider> */}
      <App />
      {/* </FormProvider> */}
    </StrictMode>
  )
}
