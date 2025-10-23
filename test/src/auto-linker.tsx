import React, { Suspense, type ReactNode } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// Auto-import all files under /pages
const files = import.meta.glob("./pages/**/*.tsx")

// Convert filenames to clean route paths
function pathToRoute(path: string) {
  return (
    path
      .replace(/^\.\/pages/, "")
      .replace(/page\.tsx$/, "")
      .replace(/not-found\.tsx$/, "*")
      .replace(/layout\.tsx$/, "")
      .replace(/\[\.\.\.([^\]]+)\]/g, "*")
      .replace(/\[([^\]]+)\]/g, ":$1")
      .replace(/\/+$/, "") || "/"
  )
}

type LazyComponent = React.LazyExoticComponent<React.ComponentType<{ children?: ReactNode }>>

const pages: { route: string; component: LazyComponent; stack: LazyComponent[] }[] = []
const layouts: Record<string, LazyComponent> = {}

// Pass 1: Collect layouts + not-found pages
Object.entries(files).forEach(([path, resolver]) => {
  const route = pathToRoute(path)
  const component = React.lazy(resolver as any) as LazyComponent

  console.log(route)

  if (path.endsWith("layout.tsx")) layouts[route] = component
  // else if (path.endsWith("not-found.tsx")) notFounds[route] = component;
})

// Pass 2: Collect normal pages
Object.entries(files).forEach(([path, resolver]) => {
  if (path.endsWith("page.tsx") || path.endsWith("not-found.tsx")) {
    const component = React.lazy(resolver as any) as LazyComponent
    const route = pathToRoute(path)
    const splited = route.split("/").filter(Boolean)

    const stack: any[] = []
    if (layouts["/"]) stack.push(layouts["/"])

    let current = ""
    for (const part of splited) {
      current = current + "/" + part
      if (layouts[current]) stack.push(layouts[current])
    }

    pages.push({ route, component, stack: stack.reverse() })
  }
})

// Helper: wrap component with its layouts
function wrapWithLayouts(Component: LazyComponent, stack: LazyComponent[]) {
  return stack.reduce((children, Layout) => <Layout>{children}</Layout>, <Component />)
}

// Main router
export default function Pages() {
  return (
    <Router>
      <Routes>
        {pages.map(({ route, component, stack }) => (
          <Route key={route} path={route} element={<Suspense fallback={<>loading</>}>{wrapWithLayouts(component, stack)}</Suspense>} />
        ))}
      </Routes>
    </Router>
  )
}
