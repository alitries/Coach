import React, { useState } from "react";
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
import { MentalHealthDialog } from "./mentalHealthDialog"; // Import the dialog

const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar: React.FC = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false); // State for OptionsDialog
  const [mentalHealthDialogOpen, setMentalHealthDialogOpen] = useState(false); // State for MentalHealthDialog

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

  const drawer = (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "64px",
          padding: "0 16px", // Add padding for some spacing
        }}
      >
        <Typography variant="h6" noWrap color={"yellow"}>
          Coach.AI
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {[
          { text: "Sports", path: "/sports" },
          { text: "Quotes", path: "/quotes" },
          { text: "Habit Tracker", path: "/habit-tracker" },
          { text: "Mental Health", path: "/mental-health" }, // Mental Health item
        ].map((item, index) => (
          <ListItem
            button
            key={item.text}
            component={item.text === "Mental Health" ? "div" : Link} // Make Mental Health a button instead of a link
            onClick={
              item.text === "Sports"
                ? handleOptionsDialogOpen
                : item.text === "Mental Health"
                ? handleMentalHealthDialogOpen
                : undefined
            } // Open the corresponding dialog
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
        anchor={isSmallScreen ? "top" : "left"} // Anchor to top on small screens
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: isSmallScreen ? "100%" : isDrawerOpen ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isSmallScreen ? "100%" : isDrawerOpen ? drawerWidth : collapsedWidth,
            height: isSmallScreen ? "auto" : "100%", // Adjust height for top drawer
            boxSizing: "border-box",
            overflowX: "hidden",
            overflowY: "auto",
            transition: "width 0.3s, height 0.3s", // Transition for both width and height
          },
        }}
      >
        {drawer}
      </Drawer>
      <OptionsDialog open={optionsDialogOpen} onClose={handleOptionsDialogClose} /> {/* Existing OptionsDialog */}
      <MentalHealthDialog open={mentalHealthDialogOpen} onClose={handleMentalHealthDialogClose} /> {/* New MentalHealthDialog */}
    </div>
  );
};

export { Sidebar };
