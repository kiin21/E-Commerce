import axios from 'axios';
// load the environment variables from the .env file

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});