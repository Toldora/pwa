import axios from 'axios';

export const sendpulseApi = axios.create({
  baseURL: import.meta.env.VITE_SENDPULSE_API_URL,
});
