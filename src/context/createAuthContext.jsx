import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * The backend issues one shared `access_token` cookie for whichever role
 * last logged in (see authMiddleware.js) — there's no per-role cookie
 * namespacing. So only one of Customer/Seller/Admin can be "logged in" in a
 * given browser at once. Each portal still gets its own React context so
 * the three areas of the app stay cleanly separated in code, but be aware
 * logging into one portal will end a session in another.
 *
 * @param {() => Promise<any>} fetchProfile - calls the role's GET /profile
 *   endpoint and resolves with the raw axios response.
 * @param {(profileResponseData: any) => any} mapUser - extracts the user
 *   object from that endpoint's response shape.
 */

export function createAuthContext({ fetchProfile, mapUser }) {
    const AuthContext = createContext(undefined);

    function AuthProvider({ children }) {

        const [user, setUser] = useState(null);
        // isLoading/hasChecked start false on purpose: mounting every portal's
        // provider at the root shouldn't fire three simultaneous profile
        // requests. Each portal's ProtectedRoute/GuestRoute calls refresh() the
        // first time that portal is actually visited (see routes/ProtectedRoute.jsx).
        
        const [isLoading, setIsLoading] = useState(false);
        const [hasChecked, setHasChecked] = useState(false);

        const refresh = useCallback(async () => {
            setIsLoading(true);
            try {
                const response = await fetchProfile();
                setUser(mapUser(response.data));
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
                setHasChecked(true);
            }
        }, []);

        const clear = useCallback(() => {
            setUser(null);
        }, []);

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
