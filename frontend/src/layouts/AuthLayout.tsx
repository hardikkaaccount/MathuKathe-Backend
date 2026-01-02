import { Outlet } from "react-router-dom";

export function AuthLayout() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">MathuKathe</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Intelligent Real-Time Communication</p>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
