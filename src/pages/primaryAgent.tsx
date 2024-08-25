import React, { useEffect, useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { getAuth } from "firebase/auth";

const ChatBubble = styled(motion.div)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  maxWidth: "80%",
  wordBreak: "break-word",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    wordBreak: "break-word",
    overflowWrap: "break-word",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 20,
    "& fieldset": {
      borderColor: theme.palette.text.primary,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.text.primary,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.text.primary,
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.text.primary,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: theme.palette.text.primary,
  },
}));

interface Message {
  text: string;
  sender: "user" | "agent";
}

const PrimaryAgent: React.FC = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [label, setLabel] = useState<string>("");
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const labels = [
      "Type your answer here...",
      "What's on your mind?",
      "Your response goes here...",
      "Share your thoughts...",
      "Enter your answer...",
    ];

    const randomLabel = labels[Math.floor(Math.random() * labels.length)];
    setLabel(randomLabel);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || "User");
    }
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/primary/chat", {
        prompt: input,
        context: "",
      });
      if (response.data && response.data.response) {
        setMessages([
          ...messages,
          { text: input, sender: "user" },
          { text: response.data.response, sender: "agent" },
        ]);
        setInput("");
        setShowWelcome(false); // Hide the welcome message
      } else {
        console.error("No response received from the server");
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }
  };

  const ExampleInputs = [
    "I want a week's schedule for exercises",
    "Provide me a recipe of spicy tomato rice",
    "How to make abs at home",
    "Provide me recipe for biryani and provide nutritional information about it",
  ];

  return (
    <div className="flex flex-col h-screen p-6">
      <div className="flex flex-col flex-grow relative">
        {showWelcome && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Typography
                variant="h1"
                className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              >
                {userName ? `Hello, ${userName}` : "Welcome to Coach.AI"}
              </Typography>
              <Typography
                variant="h6"
                color="textSecondary"
                className="text-start mt-2"
              >
                How can I help you today?
              </Typography>
            </div>
          </div>
        )}
        <div
          className={`flex flex-col flex-grow overflow-auto p-4 space-y-2 ${
            showWelcome ? "opacity-0" : "opacity-100"
          }`}
        >
          {messages.map((message, index) => (
            <ChatBubble
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={
                message.sender === "user" ? "user-bubble" : "agent-bubble"
              }
              sx={{
                backgroundColor: message.sender === "user" ? "white" : "white",
                color: message.sender === "user" ? "black" : "black",
                alignSelf:
                  message.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Typography variant="body1">
                {message.sender === "user"
                  ? `You: ${message.text}`
                  : `Agent: ${message.text}`}
              </Typography>
            </ChatBubble>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          {ExampleInputs.map((example, index) => (
            <Box
              key={index}
              sx={{
                border: "1px solid",
                borderRadius: "8px",
                padding: "8px",
                width: "48%",
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0.02)",
                cursor: "pointer", // Add cursor pointer for better UX
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
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="submit"
                  disabled={loading}
                  onClick={handleSubmit}
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

export { PrimaryAgent };
