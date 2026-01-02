import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/features/Sidebar";

export function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-white dark:bg-slate-950 overflow-hidden">
            {/* Mobile Header trigger (only visible on mobile when sidebar is closed?) 
                Actually, usually apps have a top bar on mobile or just a floating button.
                Let's add a fixed floating button or a top bar. 
                Since ChatPage has its own header, maybe a floating button is risky (overlap).
                A top bar 'MathuKathe' with Menu button on mobile is standard.
            */}

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar with mobile props */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 md:translate-x-0 md:static md:inset-auto md:flex
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-slate-950 relative">
                {/* Mobile Menu Button - Show only on mobile */}
                <div className="md:hidden absolute top-4 left-4 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                <Outlet />
            </main>
        </div>
    );
}
