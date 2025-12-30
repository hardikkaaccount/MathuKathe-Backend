import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/features/Sidebar";

export function DashboardLayout() {
    return (
        <div className="flex h-screen bg-white dark:bg-slate-950 overflow-hidden">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-slate-950 relative">
                <Outlet />
            </main>
        </div>
    );
}
