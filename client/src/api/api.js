import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const client = axios.create({
  baseURL: API_BASE,
});

export function setAuthToken(token) {
  if (token) client.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  else delete client.defaults.headers.common['Authorization'];
}

export default client;