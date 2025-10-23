import { lazy } from "react"
import Pages from "./auto-linker"
// const Page = lazy(() => import("./page"))

function App() {
  return <Pages />

  // return (
  //   <Router>
  //     <Routes>
  //       <Route
  //         path={"/"}
  //         element={
  //           <Suspense fallback={<div>LOADING</div>}>
  //             <Page />
  //           </Suspense>
  //         }
  //       />
  //     </Routes>
  //   </Router>
  // )
}

export default App
