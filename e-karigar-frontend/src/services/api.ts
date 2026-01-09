import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Connects to your NestJS Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;