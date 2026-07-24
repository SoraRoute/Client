// Shared Module
// Authors: Nishtha & Pinki

import axiosInstance from "../api/axiosInstance";
import { CUSTOMER } from "../api/endpoints";
import { createAuthContext } from "./createAuthContext";

// Extract only the customer data from the profile response.
function mapCustomerUser(payload) {
    if (!payload) return null;

    // Exclude response metadata before storing the user object.
    const { success, message, ...user } = payload;
    return user;
}

// Create authentication context for the customer portal.
export const { AuthProvider: CustomerAuthProvider, useAuthContext: useCustomerAuth } =
    createAuthContext({
        fetchProfile: () => axiosInstance.get(CUSTOMER.PROFILE),
        mapUser: mapCustomerUser,
    });