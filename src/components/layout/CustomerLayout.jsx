// Shared Module
// Authors: Nishtha & Pinki

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatWidget from "../customer/ChatWidget";

export default function CustomerLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-paper">
            <Navbar />

            {/* Render the active customer page */}
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
                <Outlet />
            </main>

            <Footer />

            {/* Keep support chat available across customer pages */}
            <ChatWidget />
        </div>
    );
}