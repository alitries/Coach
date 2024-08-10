import React from "react";
import { Cricket, HabitTracker, PrimaryAgent, Quotes, JavelinCoach } from "./pages/index";
import { Sidebar, MentalHealthDialog } from "./components/index";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { Theme } from "./config/theme";
import { ThemeProvider } from "@emotion/react";
import path from "path";

// Wrapper component that includes the Sidebar and an Outlet for the main content
const Layout = () => (
  <div style={{ display: "flex", height: "100vh" }}>
    <Sidebar />
    <div
      style={{
        flex: 1,
        overflow: "auto",
      }}
    >
      <Outlet /> {/* This will render the component based on the route */}
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Use Layout for all routes
    children: [
      {
        path: "",
        element: <PrimaryAgent />, // Default route
      },
      {
        path: "primary-agent",
        element: <PrimaryAgent />,
      },
      {
        path: "habit-tracker",
        element: <HabitTracker />,
      },
      {
        path: "cricket",
        element: <Cricket />,
      },
      {
        path: "javelin-coach",
        element: <JavelinCoach />,
      },
      {
        path: "quotes",
        element: <Quotes />,
      },
      {
        path: "mental-health",
        element: (
          <MentalHealthDialog
            open={false}
            onClose={() => {
              // Implement onClose functionality if needed
            }}
          />
        ),
      },
    ],
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
