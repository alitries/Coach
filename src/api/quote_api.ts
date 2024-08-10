import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:80';

const fetchQuote = async (feeling: string, context: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/get_quote`, { feeling, context }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if response data contains the expected 'response' field
    if (response.data && response.data.response) {
      return response.data.response;
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error;
  }
};

export { fetchQuote };
