import { Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Receipt, Store, Tag, User } from "lucide-react";
import toast from "react-hot-toast";
import DashboardShell from "./DashboardShell";
import { useAdminAuth } from "../../context/AdminAuthContext";
import axiosInstance from "../../api/axiosInstance";
import { ADMIN } from "../../api/endpoints";

const NAV_ITEMS = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/sellers", label: "Sellers", icon: Store },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/categories", label: "Categories", icon: Tag },
    { to: "/admin/orders", label: "Orders", icon: Receipt },
    { to: "/admin/profile", label: "Profile", icon: User },
];

export default function AdminLayout() {
    
    const { clear } = useAdminAuth();

    async function handleLogout() {
        try {
            await axiosInstance.post(ADMIN.LOGOUT);
        } catch (error) {
            // Cookie will expire on its own even if this call fails.
        } finally {
            clear();
            toast.success("Logged out successfully.");
        }
    }

    return (
        <DashboardShell
            portalName="Admin Console"
            accent="plum"
            navItems={NAV_ITEMS}
            onLogout={handleLogout}
        >
            <Outlet />
        </DashboardShell>
    );
}
