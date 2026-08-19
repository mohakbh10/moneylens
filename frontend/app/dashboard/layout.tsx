"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, Upload, BarChart2, LogOut } from "lucide-react";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
    const checkUser = async () => {
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
        router.push("/login");
        } else {
        setLoading(false);
        }
    };

    checkUser();
    }, [router]);

    if (loading) return null;

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Uploads", href: "/dashboard/uploads", icon: Upload },
        { name: "Insights", href: "/dashboard/insights", icon: BarChart2 },
    ];
    
    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-50 flex flex-col md:flex-row md:overflow-x-visible">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
                <h2 className="font-bold text-xl text-emerald-600">MoneyLens</h2>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Sidebar Overlay for Mobile */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-950/25 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-[80vw] max-w-[20rem] bg-white border-r p-6 transform transition-transform duration-200 ease-in-out
                md:z-40 md:w-64 md:max-w-none md:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="mb-8 flex items-center justify-between md:hidden">
                    <h2 className="font-bold text-xl text-emerald-600">
                        MoneyLens
                    </h2>
                    <button
                        aria-label="Close navigation menu"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100"
                    >
                        <X size={24} />
                    </button>
                </div>

                <h2 className="hidden md:block font-bold text-xl mb-8 text-emerald-600">
                    MoneyLens
                </h2>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.name}
                                href={item.href} 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                                    flex min-w-0 items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors md:py-2
                                    ${isActive 
                                        ? 'bg-emerald-50 text-emerald-600' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'}
                                `}
                            >
                                <item.icon size={18} className="shrink-0" />
                                <span className="truncate">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-10">
                    <Button
                        variant="outline"
                        className="min-h-[44px] w-full justify-start gap-3 md:min-h-0"
                        onClick={async () => {
                            await supabase.auth.signOut();
                            window.location.href = "/login";
                        }}
                    >
                        <LogOut size={18} />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 p-4 md:ml-64 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
