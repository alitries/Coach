import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Your Flask server URL
});

export const createUser = (userData: any) => api.post('/users', userData);
export const getUser = (email: any) => api.get(`/users/${email}`);
export const createReminder = (reminderData: any) => api.post('/reminders', reminderData);
export const getReminders = (email: any) => api.get(`/reminders/${email}`);
export const updateReminder = (email: any, habitName: any, data: any) => api.put(`/reminders/${email}/${habitName}`, data);
export const deleteReminder = (email: any, habitName: any) => api.delete(`/reminders/${email}/${habitName}`);
