import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useTheme, useMediaQuery, Divider, Box, Typography } from "@mui/material";
import axios from "axios";

const questions = [
  "What's your name?",
  "What's your email?",
  "What are your health goals?",
  "What are your health preferences?",
  "What's your current progress?",
  "Do you want to set a daily reminder to drink water? (yes/no)",
  "How many times a day do you take protein? (max 5)",
  "Enter time for protein reminder 1 (HH:MM AM/PM or HH:MM)",
  "Enter time for protein reminder 2 (HH:MM AM/PM or HH:MM)",
  "Enter time for protein reminder 3 (HH:MM AM/PM or HH:MM)",
  "Enter time for protein reminder 4 (HH:MM AM/PM or HH:MM)",
  "Enter time for protein reminder 5 (HH:MM AM/PM or HH:MM)",
  "How many times a day do you want to work out? (max 3)",
  "Enter time for workout reminder 1 (HH:MM AM/PM)",
  "Enter time for workout reminder 2 (HH:MM AM/PM)",
  "Enter time for workout reminder 3 (HH:MM AM/PM)",
  "Do you want to have Breakfast? (yes/no)",
  "What time would you like to have Breakfast? (HH:MM AM/PM)",
  "Do you want to have Lunch? (yes/no)",
  "What time would you like to have Lunch? (HH:MM AM/PM)",
  "Do you want to have Snacks? (yes/no)",
  "What time would you like to have Snacks? (HH:MM AM/PM)",
  "Do you want to have Dinner? (yes/no)",
  "What time would you like to have Dinner? (HH:MM AM/PM)",
];

export type UserData = {
  name: string;
  email: string;
  goals: string;
  preferences: string;
  progress: string;
  water_reminder: string;
  protein_times: string[];
  workout_times: string[];
  meals: { [key: string]: string };
};

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
    color: "#000",
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
  const [loading, setLoading] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [qaHistory, setQaHistory] = useState<
    { question: string; answer: string }[]
  >([]);
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
    if (input.trim() === "" || loading) return;

    const currentQuestion = questions[questionIndex];
    const newQa = { question: currentQuestion, answer: input };

    setLoading(true);
    setInput("");

    // Simulate typing delay
    for (const char of input) {
      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    setQaHistory([...qaHistory, newQa]);
    setLoading(false);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      try {
        const userData: UserData = {
          name:
            qaHistory.find((q) => q.question === questions[0])?.answer || "",
          email:
            qaHistory.find((q) => q.question === questions[1])?.answer || "",
          goals:
            qaHistory.find((q) => q.question === questions[2])?.answer || "",
          preferences:
            qaHistory.find((q) => q.question === questions[3])?.answer || "",
          progress:
            qaHistory.find((q) => q.question === questions[4])?.answer || "",
          water_reminder:
            qaHistory.find((q) => q.question === questions[5])?.answer || "",
          protein_times: [
            qaHistory.find((q) => q.question === questions[7])?.answer || "",
            qaHistory.find((q) => q.question === questions[8])?.answer || "",
            qaHistory.find((q) => q.question === questions[9])?.answer || "",
            qaHistory.find((q) => q.question === questions[10])?.answer || "",
            qaHistory.find((q) => q.question === questions[11])?.answer || "",
          ].filter(Boolean),
          workout_times: [
            qaHistory.find((q) => q.question === questions[13])?.answer || "",
            qaHistory.find((q) => q.question === questions[14])?.answer || "",
            qaHistory.find((q) => q.question === questions[15])?.answer || "",
          ].filter(Boolean),
          meals: {
            Breakfast:
              qaHistory.find((q) => q.question === questions[17])?.answer || "",
            Lunch:
              qaHistory.find((q) => q.question === questions[19])?.answer || "",
            Snacks:
              qaHistory.find((q) => q.question === questions[21])?.answer || "",
            Dinner:
              qaHistory.find((q) => q.question === questions[23])?.answer || "",
          },
        };

        await axios.post("http://localhost:5000/create_user", userData);
        alert("User created successfully!");

        await axios.post("http://localhost:5000/set_reminders", {
          email: userData.email,
          protein_times: userData.protein_times,
          workout_times: userData.workout_times,
          meals: userData.meals,
        });

        alert("Reminders set successfully!");
        setQuestionIndex(0);
        setQaHistory([]);
      } catch (error) {
        alert("Error creating user or setting reminders!");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const ExampleInputs = [
    "I want a week's schedule for exercises",
    "Provide me a recipe of spicy tomato rice",
    "How to make abs at home",
    "Provide me recipe for birayani and provide nutritional information about it"
  ];

  return (
    
    <div
      className="flex flex-col h-screen p-6"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "white",
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
                <strong>Habit Tracker: {qa.question}</strong>
              </ChatBubble>

              <UserBubble
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <b>You:</b> {qa.answer}
                </div>
              </UserBubble>
            </div>
          ))}
          <ChatBubble
            key={questionIndex}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatBubbleOutlineIcon style={{ marginRight: "8px" }} />
            <b>Habit Tracker:</b> {questions[questionIndex]}
          </ChatBubble>
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
            backgroundColor: '#f9f9f9',
            color: 'black',
          }}
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
            style: { color: "black" },

            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{ color: "black", backgroundColor: "grey", }}
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

export { Home };
