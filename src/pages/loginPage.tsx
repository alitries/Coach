import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import "../firebaseconfig";

const Login: React.FC = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const db = getFirestore();
  const navigate = useNavigate(); // Hook for navigation

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google login successful:", result.user);

      // Update user document in Firestore
      await updateUserDocument();

      // Redirect to the primary agent page
      navigate("/primary-agent");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const updateUserDocument = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (!userDocSnapshot.exists()) {
        const userData = {
          email: user.email,
          displayName: user.displayName, // Save more user info if needed
          photoURL: user.photoURL, // Example of saving the user's profile picture
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

  return (
    <Container
      maxWidth="sm"
      className="flex items-center justify-center min-h-screen bg-gray-50"
    >
      <Box
        className="p-8 bg-white shadow-lg rounded-lg"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography variant="h4" gutterBottom className="text-center">
          Welcome to MyApp
        </Typography>
        <Typography variant="body1" className="text-center mb-8">
          Please log in to continue
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full"
        >
          Login with Google
        </Button>
      </Box>
    </Container>
  );
};

export { Login };
