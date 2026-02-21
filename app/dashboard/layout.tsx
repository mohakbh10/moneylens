"use client";

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
        <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-white p-6">
            <h2 className="font-bold text-xl mb-8 text-emerald-600">
                MoneyLens
            </h2>

            <nav className="space-y-4 text-sm">
                <div className="hover:text-emerald-600 cursor-pointer">
                Dashboard
                </div>
                <div className="hover:text-emerald-600 cursor-pointer">
                Uploads
                </div>
                <div className="hover:text-emerald-600 cursor-pointer">
                Insights
                </div>
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

        <main className="flex-1 p-8">{children}</main>
        </div>
    );
}