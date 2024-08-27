import React, { useState, useRef } from "react";
import {
  Fab,
  Menu,
  ListItemIcon,
  ListItemText,
  MenuList,
  ListItem,
  Avatar,
} from "@mui/material";
import { Logout, PersonOutline, AccountCircle } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const AccountWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <Fab
        
        aria-label="account-menu"
        onClick={() => setOpen(!open)}
        ref={anchorRef}
        style={{
          position: "absolute",
          top: ".2rem",
          right: ".2rem",
          boxShadow: "none",
          backgroundColor: "transparent",
        }}
      >
        {user?.photoURL ? (
          <Avatar
            src={user.photoURL}
            alt="Profile Picture"
            sx={{
              width: "40px",
              height: "40px",
              backgroundColor: "transparent", // Removes any background color
            }}
          />
        ) : (
          <AccountCircle />
        )}
      </Fab>
      <Menu
        id="simple-menu"
        onClose={() => setOpen(false)}
        anchorEl={anchorRef.current}
        transformOrigin={{ horizontal: "right", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        style={{ marginTop: "2rem" }}
        keepMounted
        open={open}
      >
        <MenuList>
          <ListItem
            key="profile"
            component={Link}
            to="/profile"
            className="flex items-center text-white"
          >
            <ListItemIcon>
              <PersonOutline />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem
            key="logout"
            onClick={handleLogout}
            className="flex items-center text-white"
          >
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItem>
        </MenuList>
      </Menu>
      <div style={{ overflow: "hidden" }}>{children}</div>
    </div>
  );
};

export { AccountWrapper };
