import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  Cricket,
  HabitTracker,
  PrimaryAgent,
  Quotes,
  JavelinCoach,
  Login,
  Profile,
} from "./pages/index";
import { Sidebar, MentalHealthDialog } from "./components/index";
import {
  RouterProvider,
  createBrowserRouter,
  Outlet,
  Navigate,
  Link,
} from "react-router-dom";
import { Theme } from "./config/theme";
import { ThemeProvider } from "@emotion/react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Typography } from "@mui/material";
import "../src/firebaseconfig";
import { AccountWrapper } from "./components/index";
interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

const Layout: React.FC = () => (
  <AccountWrapper> {/* Wrap the layout with AccountWrapper */}
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <Outlet />
      </div>
    </div>
  </AccountWrapper>
);

interface ProtectedRouteProps {
  children: ReactNode;
}

// Component to protect routes
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ), // Use Layout for all routes
    errorElement: (
      <>
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            placeContent: "center",
          }}
        >
          <Typography sx={{ marginBottom: "8px" }} variant="h4">
            <Typography variant="h4" display={"inline"}>
              404
            </Typography>{" "}
            - Page Not Found
          </Typography>
          <Typography sx={{ marginBottom: "4px" }}>
            Looks like you aint supposed to be here.
          </Typography>
          <Link to={"/"}>
            <Typography>Click here to go to the main page.</Typography>
          </Link>
        </div>
      </>
    ),
    children: [
      {
        path: "primary-agent",
        element: <PrimaryAgent />,
      },
      {
        path: "habit-tracker",
        element: <HabitTracker />,
      },
      {
        path: "cricket-coach",
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
        element: <MentalHealthDialog open={false} onClose={() => {}} />,
      },
      {
        path: "profile",
        element : <Profile />
      }
      ],
  },
  {
    index: true,
    path: "/",
    element: <Login />,
  },
]);

const App: React.FC = () => {
  return (
    <ThemeProvider theme={Theme}>
      <AuthProvider>
        <div className="App" style={{ height: "100vh" }}>
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
