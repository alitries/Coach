import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  CssBaseline,
  AppBar,
  Toolbar,
  useMediaQuery,
  Theme,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import OptionsDialog from "./OptionsDialog";
import { MentalHealthDialog } from "./mentalHealthDialog";
import { getAuth } from "firebase/auth";

const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
  const [mentalHealthDialogOpen, setMentalHealthDialogOpen] = useState(false);

  const handleOptionsDialogOpen = () => {
    setOptionsDialogOpen(true);
  };

  const handleOptionsDialogClose = () => {
    setOptionsDialogOpen(false);
  };

  const handleMentalHealthDialogOpen = () => {
    setMentalHealthDialogOpen(true);
  };

  const handleMentalHealthDialogClose = () => {
    setMentalHealthDialogOpen(false);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || "User"); // Display a default name if displayName is null
    }
  }, []);


  const drawer = (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          minHeight: "64px",
          padding: "0 16px",
          backgroundColor: isDrawerOpen ? "transparent" : "inherit",
          // textAlign:"center"
        }}
      >
        {isDrawerOpen ? (
          <Typography
          variant="h6"
          noWrap
          color="Aqua"
          sx={{
            display: "block",
            placeContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          {userName ? `Welcome, ${userName}` : "Welcome to Coach.AI"}
        </Typography>
        ) : (
          <Typography
          variant="h6"
          noWrap
          color="Aqua"
          sx={{
            display: "block",
            placeContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
        </Typography>
        )}
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      <List>
        {[
          { text: "Sports Coach", dialogOpen: handleOptionsDialogOpen },
          { text: "Primary Agent", path: "/primary-agent" },
          { text: "Motivational Coach", path: "/quotes" },
          { text: "Habit Tracker", path: "/habit-tracker" },
          {
            text: "Mental Health Booster",
            dialogOpen: handleMentalHealthDialogOpen,
          },
        ].map((item, index) => (
          <ListItem
            button
            key={item.text}
            component={item.path ? Link : "div"}
            to={item.path}
            onClick={
              item.dialogOpen
                ? () => {
                    item.dialogOpen();
                    if (isSmallScreen) handleDrawerToggle();
                  }
                : isSmallScreen
                ? handleDrawerToggle
                : undefined
            }
          >
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            {isDrawerOpen && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>
      <Divider />
    </>
  );

  return (
    <div style={{ display: "flex" }}>
      <CssBaseline />
      {isSmallScreen && (
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Coach.AI
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        anchor={isSmallScreen ? "top" : "left"}
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: isSmallScreen
            ? "100%"
            : isDrawerOpen
            ? drawerWidth
            : collapsedWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isSmallScreen
              ? "100%"
              : isDrawerOpen
              ? drawerWidth
              : collapsedWidth,
            height: isSmallScreen ? "auto" : "100%",
            boxSizing: "border-box",
            overflowX: "hidden",
            overflowY: "auto",
            transition: "width 0.3s, height 0.3s",
          },
        }}
      >
        {drawer}
      </Drawer>
      <OptionsDialog
        open={optionsDialogOpen}
        onClose={handleOptionsDialogClose}
      />
      <MentalHealthDialog
        open={mentalHealthDialogOpen}
        onClose={handleMentalHealthDialogClose}
      />
    </div>
  );
};

export { Sidebar };
