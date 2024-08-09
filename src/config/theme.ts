import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Light blue
    },
    secondary: {
      main: "#f48fb1", // Pinkish
    },
    background: {
      default: "#121212", // Dark background
      paper: "#1e1e1e", // Slightly lighter for cards and other surfaces
    },
    text: {
      primary: "#ffffff", // White text for primary
      secondary: "#b0bec5", // Light gray for secondary text
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif", // Default font
    h1: {
      fontSize: "2rem",
      fontWeight: 500,
      fontFamily: "'Montserrat', sans-serif", // Different font for h1
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 500,
      fontFamily: "'Lato', sans-serif", // Different font for h2
    },
    body1: {
      fontSize: "1rem",
      fontFamily: "'Open Sans', sans-serif", // Different font for body text
    },
    button: {
      textTransform: "none",
      fontFamily: "'Raleway', sans-serif", // Different font for buttons
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e", // Paper background
          color: "#ffffff", // Text color on paper components
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e", // App bar background
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1e1e1e", // Drawer background
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#ffffff", // Button text color
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#ffffff", // IconButton color
        },
      },
    },
  },
  
});

export { Theme };
