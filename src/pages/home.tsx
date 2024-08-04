import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useTheme, useMediaQuery } from "@mui/material";

const AnimatedText = styled(motion.div)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontSize: "1.1rem",
  color: "black",
  whiteSpace: "pre-wrap",
  textAlign: "left",
  maxWidth: "100%",
  wordBreak: "break-word",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "80%",
    textAlign: "left",
  },
  [theme.breakpoints.down("xs")]: {
    maxWidth: "90%",
    textAlign: "center",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    wordBreak: "break-word",
    overflowWrap: "break-word",
    color: "#000",
    maxWidth: "100%",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 20,
    "& fieldset": {
      borderColor: "#000",
    },
    "&:hover fieldset": {
      borderColor: "#000",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#000",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#000",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#000",
  },
}));

const Home: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate AI response
    const simulatedResponse =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut ligula non nulla aliquet ullamcorper.\nVestibulum non felis ac eros finibus volutpat in ac lorem.\nEtiam vel velit auctor, ultrices nisi nec, aliquet justo."; // Replace with actual AI response logic
    setOutput("");

    for (const char of simulatedResponse) {
      await new Promise((resolve) => setTimeout(resolve, 30)); // Simulate typing delay
      setOutput((prev) => prev + char);
    }
    setLoading(false);
  };

  return (
    <div
      className="flex flex-col h-screen p-6"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "white", // Set the background color
        justifyContent: "flex-end",
      }}
    >
      <div className="w-full max-w-lg mx-auto" style={{ flex: "none", alignSelf: "center" }}>
        <div
          className="relative w-full"
          style={{
            textAlign: isSmallScreen ? "center" : "left",
            maxWidth: isSmallScreen ? "90%" : "70%",
            marginBottom: "16px",
          }}
        >
          {output && (
            <ChatBubbleOutlineIcon
              fontSize="large"
              className="absolute"
              style={{
                bottom: "100%", // Position the icon above the text field
                left: isSmallScreen ? "50%" : 0,
                transform: isSmallScreen ? "translateX(-50%)" : "none",
                color: "#000",
              }}
            />
          )}
          <AnimatedText
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              marginLeft: isSmallScreen ? "0" : output ? "40px" : "0",
              marginBottom: isSmallScreen ? "40px" : "0",
              alignSelf: "flex-start",
            }}
          >
            {output.split("\n").map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </AnimatedText>
        </div>
        <StyledTextField
          fullWidth
          label="Enter your input"
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          margin="normal"
          InputProps={{
            style: {
              borderRadius: "20rem",
              width: isExtraSmallScreen ? "100%" : isSmallScreen ? "80%" : "50rem",
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  <ArrowUpwardIcon sx={{ color: "#000" }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
    </div>
  );
};

export { Home };
