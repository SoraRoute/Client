// Shared Module
// Authors: Nishtha & Pinki

import axiosInstance from "../api/axiosInstance";
import { ADMIN } from "../api/endpoints";
import { createAuthContext } from "./createAuthContext";

// adminController.getAdminProfile responds { success, message, data }
function mapAdminUser(payload) {
    if (!payload) return null;
    return payload.data ?? null;
}

export const { AuthProvider: AdminAuthProvider, useAuthContext: useAdminAuth } =
    createAuthContext({
        fetchProfile: () => axiosInstance.get(ADMIN.PROFILE),
        mapUser: mapAdminUser,
    });
