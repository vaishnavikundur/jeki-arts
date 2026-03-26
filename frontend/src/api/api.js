import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://jeki-arts.onrender.com';

const api = axios.create({
    baseURL: API_URL,
});

export default api;
