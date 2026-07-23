import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { CUSTOMER_WISHLIST } from "../api/endpoints";
import { useCustomerAuth } from "../context/CustomerAuthContext";

export default function useWishlist() {
    const { isAuthenticated } = useCustomerAuth();
    const navigate = useNavigate();
    const [wishlistedIds, setWishlistedIds] = useState(new Set());

    const loadWishlistIds = useCallback(async () => {
        if (!isAuthenticated) {
            setWishlistedIds(new Set());
            return;
        }
        try {
            const res = await axiosInstance.get(CUSTOMER_WISHLIST.BASE);
            setWishlistedIds(new Set((res.data.wishlist || []).map((p) => p.id)));
        } catch {
            // Non-critical — wishlist hearts just won't be pre-filled.
        }
    }, [isAuthenticated]);

    useEffect(() => {
        loadWishlistIds();
    }, [loadWishlistIds]);
    

    async function toggleWishlist(product) {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        const isWishlisted = wishlistedIds.has(product.id);
        try {
            if (isWishlisted) {
                await axiosInstance.delete(CUSTOMER_WISHLIST.ITEM(product.id));
                setWishlistedIds((prev) => {
                    const next = new Set(prev);
                    next.delete(product.id);
                    return next;
                });
                toast.success("Removed from wishlist");
            } else {
                await axiosInstance.post(CUSTOMER_WISHLIST.ITEM(product.id));
                setWishlistedIds((prev) => new Set(prev).add(product.id));
                toast.success("Added to wishlist");
            }
        } catch (err) {
            toast.error(err.friendlyMessage || "Something went wrong.");
        }
    }

    return { wishlistedIds, toggleWishlist, reloadWishlist: loadWishlistIds };
}
