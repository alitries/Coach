import React from "react";
import { Home, Cricket, HabbitTracker } from "./pages/index";
import { Sidebar, MentalHealthDialog } from "./components/index";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
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
  {
    path: "/cricket",
    element: <Cricket />,
  },
  {
    path: "/mental-health",
    element: <MentalHealthDialog open={false} onClose={function (): void {
      throw new Error("Function not implemented.");
    } } />,
  },
  {
    path: "/habbit-tracker",
    element: <HabbitTracker />,
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
