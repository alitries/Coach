import axios from 'axios';

// Base URLs
const API_BASE = "http://localhost:5000";
const apiClient = axios.create({ baseURL: API_BASE, timeout: 10000 });

// ----- Users and Reminders API -----
export const createUser = (userData: any) => apiClient.post('/habit/users', userData);
export const getUser = (email: any) => apiClient.get(`/habit/users/${email}`);
export const createReminder = (reminderData: any) => apiClient.post('/habit/reminders', reminderData);
export const getReminders = (email: any) => apiClient.get(`/habit/reminders/${email}`);
export const updateReminder = (email: any, habitName: any, data: any) => apiClient.put(`/habit/reminders/${email}/${habitName}`, data);
export const deleteReminder = (email: any, habitName: any) => apiClient.delete(`/habit/reminders/${email}/${habitName}`);

// ----- Quotes API -----
export const fetchQuote = async (feeling: string, context: string) => {
  try {
    const response = await apiClient.post("/quote/get_quote", { feeling, context }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

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

// ----- Javelin API -----
export const fetchJavelinQuote = async (prompt: string) => {
  try {
    const response = await apiClient.post("/javelin/get_quote", { prompt }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

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

// ----- Recreational Activities API -----
export const fetchRecreationalActivities = async (latitude: number, longitude: number) => {
  try {
    const response = await apiClient.post("/mental_health/find_activities", { latitude, longitude }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data && response.data.message) {
      return response.data.message;
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    throw error;
  }
};

// ----- Chat API -----
export const sendChatPrompt = async (prompt: any, context = "") => {
  try {
    const response = await apiClient.post("/primary/chat", { prompt, context });
    return response.data;
  } catch (error) {
    console.error("Error communicating with the server:", error);
    throw error;
  }
};
