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
  useMediaQuery,
  Theme,
  AppBar,
  Toolbar,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import OptionsDialog from "./OptionsDialog"; // Import the dialog component


const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const drawer = (
    <>
      <Typography
        sx={{
          fontSize: "2rem",
          marginTop: "1rem",
          marginBottom: "0",
          textAlign: "center",
        }}
      >
        Coach
      </Typography>
      <Divider />
      <List>
        {["Quotes", "Habbit Tracker", "Sports"].map((text, index) => (
          <ListItem
            button
            key={text}
            onClick={text === "Sports" ? handleDialogOpen : undefined} // Only "Inbox" opens the dialog
          >
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </>
  );

  return (
    <div style={{ display: "flex" }}>
      <CssBaseline />
      {isSmallScreen ? (
        <>
          <AppBar position="fixed">
            <Toolbar disableGutters>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                Coach
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="temporary"
            anchor="top"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              [`& .MuiDrawer-paper`]: {
                boxSizing: "border-box",
                width: "100%",
                height: "auto",
              },
            }}
          >
            {drawer}
          </Drawer>
        </>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
        <OptionsDialog open={dialogOpen} onClose={handleDialogClose} />
    </div>
  );
};

export { Sidebar };
