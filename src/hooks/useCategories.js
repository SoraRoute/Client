// Shared Module
// Authors: Nishtha & Pinki

import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { CATEGORIES } from "../api/endpoints";

// Fetch categories once when the component mounts.
export default function useCategories() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    async function load() {

        setIsLoading(true);
        setError("");
        try {
            const res = await axiosInstance.get(CATEGORIES.CUSTOMER_LIST);
            setCategories(res.data.data || []);
        } catch (err) {
            setError(err.friendlyMessage || "Failed to load categories.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    return { categories, isLoading, error, reload: load };
}
