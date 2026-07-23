import { Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Receipt, User, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import DashboardShell from "./DashboardShell";
import { useSellerAuth } from "../../context/SellerAuthContext";
import axiosInstance from "../../api/axiosInstance";
import { SELLER } from "../../api/endpoints";
import Navbar from "./Navbar";

// Navigation links shown in the seller dashboard sidebar.
const NAV_ITEMS = 
[
	{ to: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
	{ to: "/seller/products", label: "Products", icon: Package },
	{ to: "/seller/orders", label: "Orders", icon: Receipt },
	{ to: "/seller/revenue", label: "Revenue", icon: Wallet },
	{ to: "/seller/profile", label: "Profile", icon: User },
];

export default function SellerLayout() {

	const { clear } = useSellerAuth();
	// Logs out the seller and clears the local auth state.
	
	async function handleLogout() {
		try{
			await axiosInstance.post(SELLER.LOGOUT);

		} catch (error) {
			// Ignore API errors and continue clearing the session.

		} finally {
			clear();
			toast.success("Logged out successfully.");
		}
	}

	return (
		<DashboardShell
			portalName="Seller Studio"
			accent="teal"
			navItems={NAV_ITEMS}
			onLogout={handleLogout}
		>
			{/* Renders the selected seller page */}
			<Outlet />
		</DashboardShell>
	);
}