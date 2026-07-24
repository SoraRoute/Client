// Shared Module
// Authors: Nishtha & Pinki

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, Menu, X, User } from "lucide-react";
import Footer from "../layout/sellerAdminFooter";

const ACCENT_CLASSES = {
    teal: {
        active: "bg-teal-50 text-teal-700",
        ring: "ring-teal-500",
        badge: "bg-teal-500",
    },
    plum: {
        active: "bg-plum-50 text-plum-700",
        ring: "ring-plum-500",
        badge: "bg-plum-500",
    },
};

export default function DashboardShell({
    portalName,
    accent = "teal",
    navItems,
    onLogout,
    children,
}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    // Pick the color palette based on the active portal.
    const colors = ACCENT_CLASSES[accent];

    const linkClass = ({ isActive }) =>
        [
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            isActive
                ? colors.active
                : "text-ink-muted hover:bg-ink/5 hover:text-ink",
        ].join(" ");

    // Reuse the same navigation for desktop and mobile layouts.
    const sidebarContent = (
        <>
            <div className="flex items-center gap-2 px-2 py-2">
                <span className={`h-2 w-2 rounded-full ${colors.badge}`} />

                <span className="font-display text-sm font-semibold uppercase tracking-wide text-ink-muted">
                    {portalName}
                </span>
            </div>

            <nav className="mt-4 flex flex-1 flex-col gap-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={linkClass}
                        onClick={() => setMobileOpen(false)}
                    >
                        {item.icon && (
                            <item.icon size={17} strokeWidth={1.9} />
                        )}

                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <button
                onClick={onLogout}
                className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-ink/5 hover:text-ink"
            >
                <LogOut size={17} />
                Log out
            </button>
        </>
    );

    return (
        <div className="min-h-screen bg-paper">

            {/* Top navigation */}
            <header className="flex h-16 border-b border-black bg-black">

                {/* Brand */}
                <div className="flex w-64 items-center gap-3 px-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                        <img
                            src="/favicon.svg"
                            alt="MarketHive Logo"
                            className="h-8 w-8 object-contain"
                        />
                    </div>

                    <h1 className="font-display text-lg font-bold text-white">
                        MarketHive
                    </h1>
                </div>

                {/* Current user */}
                <div className="ml-auto flex items-center gap-3 px-6">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-medium text-white">
                            {portalName}
                        </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-white">
                        <User size={20} />
                    </div>
                </div>
            </header>

            {/* Mobile menu toggle */}
            <div className="flex items-center justify-between border-b border-paper-line bg-paper-raised px-4 py-3 md:hidden">
                <span className="font-display text-sm font-semibold uppercase tracking-wide text-ink-muted">
                    {portalName}
                </span>

                <button onClick={() => setMobileOpen((v) => !v)}>
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile navigation */}
            {mobileOpen && (
                <div className="border-b border-paper-line bg-paper-raised px-3 pb-3 md:hidden">
                    {sidebarContent}
                </div>
            )}

            {/* Dashboard layout */}
            <div className="flex min-h-[calc(100vh-4rem)]">

                {/* Desktop sidebar */}
                <aside className="hidden w-64 shrink-0 flex-col border-r border-paper-line bg-paper-raised px-3 py-5 md:flex">
                    {sidebarContent}
                </aside>

                {/* Main content */}
                <div className="flex flex-1 flex-col">
                    <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
                        {children}
                    </main>

                    <Footer />
                </div>
            </div>
        </div>
    );
}