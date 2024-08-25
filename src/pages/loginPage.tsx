import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import {
  Container,
  Paper,
  Box,
  Avatar,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Button,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import SignUpDialog from "../components/signUpDialog";
import "../firebaseconfig";

const Login: React.FC = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const db = getFirestore();
  const navigate = useNavigate();

  // State variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Email login successful");
      setLoginError(null);
      await updateUserDocument();
      navigate("/primary-agent");
    } catch (error: any) {
      console.error("Error signing in with email and password:", error);
      handleLoginError(error);
    }
  };

  // Handler for Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google login successful:", result.user);
      await updateUserDocument();
      navigate("/primary-agent");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setLoginError("Google sign-in failed. Please try again.");
    }
  };

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Update or create user document in Firestore
  const updateUserDocument = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (!userDocSnapshot.exists()) {
        const userData = {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        try {
          await setDoc(userDocRef, userData);
          console.log("User document created in Firestore");
        } catch (error) {
          console.error("Error creating user document:", error);
        }
      } else {
        console.log("User document already exists in Firestore");
      }
    }
  };

  // Handle errors during login
  const handleLoginError = (error: any) => {
    if (error.code === "auth/wrong-password") {
      setLoginError("Incorrect password. Please try again.");
    } else if (error.code === "auth/user-not-found") {
      setLoginError("User not found. Please sign up or try again.");
    } else {
      setLoginError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <Container maxWidth="xs">
        <Paper elevation={6} className="p-8 bg-white rounded-lg shadow-lg">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            className="mb-6"
          >
            <Typography sx={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
              WELCOME TO COACH
            </Typography>
            <Avatar className="bg-indigo-500 mb-2">
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" className="text-gray-800">
              Sign in
            </Typography>
          </Box>
          <Box component="form" noValidate>
            <TextField
              name="email"
              label="Email"
              required
              type="email"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ marginBottom: ".5rem" }}
              InputProps={{
                style: { color: "#4A5568" }, // Tailwind's gray-700
              }}
              InputLabelProps={{
                style: { color: "#4A5568" },
              }}
            />
            <TextField
              name="password"
              label="Password"
              required
              type={showPassword ? "text" : "password"}
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              sx={{ marginBottom: "1rem" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: { color: "#4A5568" },
              }}
              InputLabelProps={{
                style: { color: "#4A5568" },
              }}
            />
            {loginError && (
              <Typography
                variant="body2"
                className="text-red-500 text-center mb-4"
              >
                {loginError}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleEmailLogin}
              fullWidth
              className="mb-4 py-2 transition-transform transform hover:scale-105"
            >
              Login via Email
            </Button>
            <Box className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-2 text-gray-500">Or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </Box>
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              fullWidth
              className="py-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Sign in with Google
            </Button>
            <Button
              variant="text"
              color="secondary"
              fullWidth
              onClick={() => setIsSignupDialogOpen(true)}
              className="mt-4"
            >
              Don't have an account? Sign Up
            </Button>
          </Box>
        </Paper>
      </Container>
      <SignUpDialog open={isSignupDialogOpen} onClose={() => setIsSignupDialogOpen(false)} />
    </div>
  );
};

export { Login };
