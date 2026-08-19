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
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
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
                    className="fixed inset-0 bg-black/20 z-40 md:hidden" 
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-white border-r p-6 transform transition-transform duration-200 ease-in-out
                md:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
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
                                    flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                                    ${isActive 
                                        ? 'bg-emerald-50 text-emerald-600' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'}
                                `}
                            >
                                <item.icon size={18} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-10">
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-3"
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
