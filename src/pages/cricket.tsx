import React, { useEffect, useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import { fetchCricketAdvice } from "../api/All_api";

interface Message {
  text: string;
  sender: "user" | "agent";
}

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

const Cricket: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [label, setLabel] = useState<string>("");
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const labels = [
      "Type your question here...",
      "Ask your cricket coach...",
      "Your question goes here...",
      "Share your thoughts...",
      "Enter your query...",
    ];

    const randomLabel = labels[Math.floor(Math.random() * labels.length)];
    setLabel(randomLabel);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const response = await fetchCricketAdvice(input, "");
      if (response) {
        setMessages([
          ...messages,
          { text: input, sender: "user" },
          { text: response, sender: "agent" },
        ]);
        setInput("");
        setShowWelcome(false);
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  };

  const ExampleInputs = [
    "What is the correct grip for holding a cricket bat to achieve optimal control and power?",
    "How should I position my feet when facing a fast bowler to improve my stance and shot selection?",
    "What are the key techniques for executing a perfect cover drive in cricket?",
    "What are some beginner drills I can practice to improve my bowling accuracy and consistency?",
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
                Welcome to Cricket Coach
              </Typography>
              <Typography
                variant="h6"
                color="textSecondary"
                className="text-start mt-2"
              >
                How can I assist you with Cricket today?
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

export { Cricket };
