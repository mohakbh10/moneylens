"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
export default function DashboardLayout({children}: {children: React.ReactNode}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

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
    }, []);

    if (loading) return null;
    
    return (
        <div className="min-h-screen">
        <aside className="fixed left-0 top-0 w-64 h-full border-r bg-white p-6">
            <h2 className="font-bold text-xl mb-8 text-emerald-600">
                MoneyLens
            </h2>

            <nav className="space-y-4 text-sm">
                <Link href="/dashboard" className="block hover:text-emerald-600 cursor-pointer">
                    Dashboard
                </Link>
                <Link href="/dashboard/uploads" className="block hover:text-emerald-600 cursor-pointer">
                    Uploads
                </Link>
                <Link href="/dashboard/insights" className="block hover:text-emerald-600 cursor-pointer">
                    Insights
                </Link>
            </nav>
            <Button
                variant="outline"
                className="mt-10 w-full"
                onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = "/login";
                }}
                >
                Logout
                </Button>
        </aside>

        <main className="flex-1 p-8 ml-64">{children}</main>
        </div>
    );
}