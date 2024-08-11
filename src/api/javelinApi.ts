import axios from 'axios';

// Define the base URL of your Flask server
const API_BASE_URL = 'http://localhost:80'; // Adjust if your Flask server runs on a different port

// Function to fetch a quote from the Flask backend
export const fetchQuote = async (prompt: string) => {
  try {
    // Send a POST request with form data
    const formData = new FormData();
    formData.append('prompt', prompt);

    const response = await axios.post(`${API_BASE_URL}/get_quote`, formData);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error fetching quote:', error);
    throw error;
  }
};
