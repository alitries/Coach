import React from "react";
import { Home } from "./pages/index";
import { Sidebar } from "./components/index";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { Theme } from "./config/theme";
import { ThemeProvider } from "@emotion/react";

const Wrapper = () => (
  <div style={{ display: "flex", height: "100vh" }}>
    <Sidebar />
    <div
      style={{
        flex: 1,
        overflow: "auto",
      }}
    >
      <Home />
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Wrapper />,
  },
  {
    path: "/home",
    element: <Home />,
  },
]);

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <div className="App" style={{ height: "100vh" }}>
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}

export default App;
