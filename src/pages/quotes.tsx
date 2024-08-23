import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useTheme, useMediaQuery, Divider, Box, Typography } from "@mui/material";
// Assuming the module exists and is properly exported
import { fetchQuote } from "../api/All_api";

const ChatBubble = styled(motion.div)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 20,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  maxWidth: "100%",
  wordBreak: "break-word",
  alignSelf: "flex-start",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}));

const UserBubble = styled(ChatBubble)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  alignSelf: "flex-end",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    wordBreak: "break-word",
    overflowWrap: "break-word",
    color: "#fff",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 20,
    "& fieldset": {
      borderColor: "#fff",
    },
    "&:hover fieldset": {
      borderColor: "#fff",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#fff",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#fff",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fff",
  },
}));

const Quotes: React.FC = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [qaHistory, setQaHistory] = useState<{ question: string; answer: string }[]>([]);
  const [label, setLabel] = useState<string>("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const labels = [
      "Type your answer here...",
      "What's on your mind?",
      "Your response goes here...",
      "Share your thoughts...",
      "Enter your answer...",
    ];

    // Randomly pick a label
    const randomLabel = labels[Math.floor(Math.random() * labels.length)];
    setLabel(randomLabel);
  }, []);

  const handleSubmit = async () => {
    if (!input.trim()) return; // Prevent empty submissions

    setLoading(true);

    try {
      const response = await fetchQuote(input, ""); // Call the API with user input
      setQaHistory([...qaHistory, { question: input, answer: response }]);
      setInput(""); // Clear input after submission
      setQuestionIndex(questionIndex + 1);
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const ExampleInputs = [
    "I am feeling low today.",
    "I had a bad day at work and i dont feel like working out.",
    // "How to make abs at home",
    // "Provide me recipe for biryani and provide nutritional information about it",
  ];

  return (
    <div
      className="flex flex-col h-screen p-6"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#1d1d1d",
        justifyContent: "flex-end",
        alignItems: "center", // Ensure centering in the main axis
        overflowX: "hidden", // Prevent horizontal overflow
      }}
    >
      <div
        className="w-full max-w mx-auto"
        style={{ flex: "none", alignSelf: "center" }}
      >
        <div
          className="relative w-full"
          style={{
            textAlign: isSmallScreen ? "center" : "left",
            maxWidth: isSmallScreen ? "90%" : "70%",
            marginBottom: "16px",
            overflowX: "hidden", // Prevent horizontal overflow
          }}
        >
          {qaHistory.map((qa, index) => (
            <div key={index}>
              <ChatBubble
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChatBubbleOutlineIcon style={{ marginRight: "8px" }} />
                <strong>Motivational Coach: {qa.answer}</strong>
              </ChatBubble>

              <UserBubble
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <b>You:</b> {qa.question}
                </div>
              </UserBubble>
            </div>
          ))}
        </div>
        <Divider />
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          {ExampleInputs.map((example, index) => (
            <Box
              key={index}
              sx={{
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                width: '48%', // Adjust width to fit two boxes side by side
                textAlign: 'center',
                backgroundColor: '#1d1d1d',
                color: 'white',
                cursor: 'pointer',
              }}
              onClick={() => setInput(example)}
            >
              <Typography variant="body2">{example}</Typography>
            </Box>
          ))}
        </Box>
        <StyledTextField
          className="mb-4"
          variant="outlined"
          label={label}
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            style: { color: "white" },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{ color: "black", backgroundColor: "grey" }}
                >
                  {loading ? <ChatBubbleOutlineIcon /> : <ArrowUpwardIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
    </div>
  );
};

export { Quotes };
