// src/api.js
import axios from 'axios';

// Create an Axios instance if needed (optional)
const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your Flask server URL
  timeout: 10000, // Optional: Set a timeout
});

// Define a function to send a chat prompt
export const sendChatPrompt = async (prompt: any, context = "") => {
  try {
    const response = await apiClient.post('/chat', { prompt, context });
    return response.data;
  } catch (error) {
    console.error("Error communicating with the server:", error);
    throw error;
  }
};
