import React, { useEffect, useState } from "react";
import {
  Avatar,
  Paper,
  Typography,
  TextField,
  Tooltip,
  styled,
} from "@mui/material";
import { auth, db } from "../firebaseconfig";
import { getFirestore, updateDoc, doc, getDoc } from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const StyledTextField = styled(TextField)`
  margin-bottom: 10px;
`;

interface UserDetails {
  displayName: string;
  email: string;
  photoURL: string;
  phone: string;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newDisplayName, setNewDisplayName] = useState<string>("");
  const [newPhoneNumber, setNewPhoneNumber] = useState<string>("");
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState<boolean>(true);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    displayName: "",
    email: "",
    photoURL: "",
    phone: "",
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      getDoc(userRef).then((doc) => {
        const data = doc.data();
        if (data) {
          setUserDetails({
            displayName: data.name || user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
            phone: data.phone || "",
          });
          setNewDisplayName(data.name || user.displayName || "");
          setNewPhoneNumber(data.phone || "");
        }
      });
    }
  }, []);

  const handleNameSaveClick = async () => {
    const user = auth.currentUser;
    if (user) {
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);

      try {
        await updateDoc(userRef, {
          name: newDisplayName,
          phone: newPhoneNumber,
        });
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          displayName: newDisplayName,
        }));
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
  };

  const handleNumberSaveClick = async () => {
    const isPhoneNumberValid = validatePhoneNumber(newPhoneNumber);

    if (!isPhoneNumberValid) {
      console.log("Phone number is invalid");
      return;
    }

    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);

      try {
        await updateDoc(userRef, { phone: newPhoneNumber });
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          phone: newPhoneNumber,
        }));
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating document:", error);
      }
      //   logEvent(analytics, 'save_phone_number', {
      //     uid: user.uid,
      //     phone_number: newPhoneNumber,
      //   });
    }
  };

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const isValidPhoneNumber = /^[789]\d{9}$/g.test(phoneNumber);
    setIsPhoneNumberValid(isValidPhoneNumber);
    return isValidPhoneNumber;
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div
      className="account-page"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper elevation={3} className="account-paper" sx={{width:"30rem", padding:"1rem", marginRight:"1rem", marginLeft:"1rem"}}>
        <Avatar
          style={{ margin: "0 auto", width: "60px", height: "60px" }}
          src={userDetails.photoURL}
        >
          {userDetails.displayName
            ? userDetails.displayName.charAt(0).toUpperCase()
            : ""}
        </Avatar>
        <Typography
          variant="h5"
          style={{ textAlign: "center", margin: "20px 0" }}
        >
          Your Profile
        </Typography>
        {isEditing ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <StyledTextField
              label="Name"
              variant="outlined"
              fullWidth
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Tooltip title="Save">
                    <SaveIcon
                      style={{ cursor: "pointer" }}
                      onClick={handleNameSaveClick}
                    />
                  </Tooltip>
                ),
              }}
            />
            <StyledTextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={newPhoneNumber}
              onChange={(e) => setNewPhoneNumber(e.target.value)}
              error={!isPhoneNumberValid}
              helperText={!isPhoneNumberValid && "Invalid phone number"}
              sx={{ marginTop: "10px" }}
              InputProps={{
                endAdornment: (
                  <Tooltip title="Save Phone Number">
                    <SaveIcon
                      style={{ cursor: "pointer" }}
                      onClick={handleNumberSaveClick}
                    />
                  </Tooltip>
                ),
              }}
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              disabled
              value={userDetails.displayName}
              sx={{ marginRight:"1rem", marginLeft:"1rem"}}
              InputProps={{
                endAdornment: (
                  <Tooltip title="Edit Name" placement="top-start">
                    <EditIcon
                      style={{ cursor: "pointer" }}
                      onClick={handleEditClick}
                    />
                  </Tooltip>
                ),
              }}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              disabled
              value={userDetails.phone || "Add Phone Number"}
              sx={{ marginTop: "10px" }}
              InputProps={{
                endAdornment: (
                  <Tooltip title="Edit Phone Number" placement="top-start">
                    <EditIcon
                      style={{ cursor: "pointer" }}
                      onClick={handleEditClick}
                    />
                  </Tooltip>
                ),
              }}
            />
          </div>
        )}
        <StyledTextField
          label="Email"
          variant="outlined"
          fullWidth
          disabled
          value={userDetails.email}
          sx={{ marginTop: "10px" }}
        />
      </Paper>
    </div>
  );
};

export { Profile };
