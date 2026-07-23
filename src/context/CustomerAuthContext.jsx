import axiosInstance from "../api/axiosInstance";
import { CUSTOMER } from "../api/endpoints";
import { createAuthContext } from "./createAuthContext";

// customerController.getCustomerProfile returns the service's raw result
// object at the top level (not nested under `data`). Shape depends on
// customerService.getCustomerProfile — treat the whole payload as the user
// record, minus the success/message envelope keys.
function mapCustomerUser(payload) {
  if (!payload) return null;
  const { success, message, ...user } = payload;
  return user;
}

export const { AuthProvider: CustomerAuthProvider, useAuthContext: useCustomerAuth } =
  createAuthContext({
    fetchProfile: () => axiosInstance.get(CUSTOMER.PROFILE),
    mapUser: mapCustomerUser,
  });
