import axiosInstance from "../api/axiosInstance";
import { SELLER } from "../api/endpoints";
import { createAuthContext } from "./createAuthContext";

// sellerController.getSellerProfile responds { success, message, sellerData }
function mapSellerUser(payload) {
	if (!payload) return null;
	return payload.sellerData ?? null;
}

export const { AuthProvider: SellerAuthProvider, useAuthContext: useSellerAuth } =
	createAuthContext({
		fetchProfile: () => axiosInstance.get(SELLER.PROFILE),
		mapUser: mapSellerUser,
	});
