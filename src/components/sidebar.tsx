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
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { OptionsDialog, MentalHealthDialog } from "./index";

const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar: React.FC = () => {
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
        }}
      >
        {isDrawerOpen ? (
          <Box
            sx={{
              backgroundImage: "url(../images/coach.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "100%",
              height: "58px",
            }}
          />
        ) : (
          <Typography
            variant="h6"
            noWrap
            color={"Aqua"}
            sx={{
              display: "block",
              placeContent: "center",
              textAlign: "center",
              width: "100%",
            }}
          />
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
          {
            text: "Primary Agent",
            icon: <AccountCircleIcon />,
            path: "/primary-agent",
          },
          {
            text: "Sports Coach",
            icon: <SportsBasketballIcon />,
            dialogOpen: handleOptionsDialogOpen,
          },
          {
            text: "Motivational Coach",
            icon: <EmojiObjectsIcon />,
            path: "/quotes",
          },
          {
            text: "Habit Tracker",
            icon: <TrackChangesIcon />,
            path: "/habit-tracker",
          },
          {
            text: "Mental Health Booster",
            icon: <FavoriteIcon />,
            dialogOpen: handleMentalHealthDialogOpen,
          },
        ].map((item) => (
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
            <ListItemIcon>{item.icon}</ListItemIcon>
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
