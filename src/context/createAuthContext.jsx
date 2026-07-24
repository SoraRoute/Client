// Shared Module
// Authors: Nishtha & Pinki

import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Creates a reusable authentication context for different user roles.
 *
 * @param {() => Promise<any>} fetchProfile - Fetches the logged-in user's profile.
 * @param {(profileResponseData: any) => any} mapUser - Maps the API response to the user object.
 */
export function createAuthContext({ fetchProfile, mapUser }) {
    const AuthContext = createContext(undefined);

    function AuthProvider({ children }) {

        const [user, setUser] = useState(null);

        // Profile is fetched only when the portal actually needs authentication.
        const [isLoading, setIsLoading] = useState(false);
        const [hasChecked, setHasChecked] = useState(false);

        const refresh = useCallback(async () => {
            setIsLoading(true);
            try {
                const response = await fetchProfile();
                setUser(mapUser(response.data));
            } catch (error) {
                // Clear user state if profile request fails.
                setUser(null);
            } finally {
                setIsLoading(false);
                setHasChecked(true);
            }
        }, []);

        const clear = useCallback(() => {
            setUser(null);
        }, []);

        // Memoize context value to avoid unnecessary re-renders.
        const value = useMemo(
            () => ({
                user,
                setUser,
                isAuthenticated: Boolean(user),
                isLoading,
                hasChecked,
                refresh,
                clear,
            }),
            [user, isLoading, hasChecked, refresh, clear],
        );

        return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    }

    function useAuthContext() {
        const ctx = useContext(AuthContext);
        if (ctx === undefined) {
            throw new Error("useAuthContext must be used within its matching AuthProvider");
        }
        return ctx;
    }

    return { AuthProvider, useAuthContext };
}