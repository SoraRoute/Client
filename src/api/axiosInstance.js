import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

// The backend authenticates purely via an httpOnly `access_token` cookie
// (see authMiddleware.js / cookieHelper.js), so every request must be sent
// with credentials — there is no bearer token to attach manually.
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Normalizes whatever shape the backend throws back (it isn't fully
// consistent — some error bodies are {success, message}, some are plain
// express-validator arrays) into a single readable string so every page
// can just do `catch (err) { toast.error(err.message) }`.

export function extractErrorMessage(error) {
    if (axios.isCancel(error)) return "Request cancelled.";
    const data = error?.response?.data;

    if (!data) {
        return error?.message || "Something went wrong. Please try again.";
    }

    if (Array.isArray(data.errors) && data.errors.length > 0) {
        // express-validator via validationMiddleware.js: { success, message, errors: [...] }
        return data.errors[0].msg || data.message || "Validation failed.";
    }

    return data.message || "Something went wrong. Please try again.";
}

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        error.friendlyMessage = extractErrorMessage(error);
        return Promise.reject(error);
    },
);

export default axiosInstance;
