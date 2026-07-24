// Shared Module
// Authors: Nishtha & Pinki

import axios from "axios";

// Centralized API instance with authentication support.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});
export default api;