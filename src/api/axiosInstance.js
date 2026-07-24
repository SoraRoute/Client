// Shared Module
// Authors: Nishtha & Pinki

import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

// Shared Axios instance used across customer, seller, and admin modules.
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    // Required so authentication cookies are sent with every request.
    withCredentials: true,
});

// Converts different backend error formats into a single readable message.
export function extractErrorMessage(error) {
    if (axios.isCancel(error)) return "Request cancelled.";
    const data = error?.response?.data;

    if (!data) {
        return error?.message || "Something went wrong. Please try again.";
    }

    if (Array.isArray(data.errors) && data.errors.length > 0) {
        // Handle validation errors returned by the backend.
        return data.errors[0].msg || data.message || "Validation failed.";
    }

    return data.message || "Something went wrong. Please try again.";
}

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Attach a user-friendly message before passing the error along.
        error.friendlyMessage = extractErrorMessage(error);
        return Promise.reject(error);
    },
);

export default axiosInstance;