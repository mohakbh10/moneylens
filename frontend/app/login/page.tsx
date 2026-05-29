"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword((prev) => !prev);

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        });

        if (error) {
        alert(error.message);
        } else {
        router.push("/dashboard");
        }
    };

    const handleSignup = async () => {
        const { error } = await supabase.auth.signUp({
        email,
        password,
        });

        if (error) {
        alert(error.message);
        } else {
        alert("Check your email to confirm.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
            <h1 className="text-3xl font-bold text-center">MoneyLens</h1>

            <Input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
            <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-3 flex items-center text-sm text-slate-500"
            >
                {showPassword ? "Hide" : "Show"}
            </button>
            </div>

            <Button className="w-full" onClick={handleLogin}>
            Login
            </Button>

            <Button variant="outline" className="w-full" onClick={handleSignup}>
            Sign Up
            </Button>
        </div>
        </div>
    );
}
