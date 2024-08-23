import React, { useEffect, useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Box, Typography, Divider } from "@mui/material";
import { fetchJavelinQuote } from '../api/All_api'; // Import the fetchQuote function

// Styled components for chat bubbles
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

const JavelinCoach: React.FC = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [label, setLabel] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (input.trim() === "") return;

    setLoading(true);

    // Add user's message to chat
    const newMessages: Message[] = [...messages, { text: input, sender: "user" as "user" }];
    setMessages(newMessages);

    try {
      // Call the API function to fetch the quote
      const response  = await fetchJavelinQuote(input);

      // Add agent's response to chat
      setMessages([...newMessages, { text: response, sender: "agent" }]);
    } catch (error) {
      console.error("Error fetching quote:", error);
      setMessages([
        ...newMessages,
        { text: "Sorry, something went wrong.", sender: "agent" },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const ExampleInputs = [
    "What is the correct grip to hold a javelin for optimal throwing technique?",
    "How should I position my body during the approach run to maximize throwing distance?",
    "What are the key phases of the javelin throw, and how can I improve each phase?",
    "What are some beginner drills I can practice to develop strength and technique for javelin throwing?",
  ];

  return (
    <div className="flex flex-col h-screen p-6">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col flex-grow overflow-auto p-4 space-y-2">
          {/* Display messages */}
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
          <div ref={messagesEndRef} /> {/* Ref to scroll to */}
        </div>

        <Divider />

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

export { JavelinCoach };
