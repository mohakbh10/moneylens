"use client";

import {useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import {
    processStatement,
} from "@/lib/api";
import StatementHistory from "@/components/dashboard/StatementHistory";
import { toast } from "sonner";
import FadeIn from "@/components/animations/FadeIn";
import { motion } from "framer-motion";

type Upload = {
    id: string;
    file_name: string;
    created_at: string;
};

export default function UploadsPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const router = useRouter();
    const canAnimate = !loading && !!file;
    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a PDF statement first.");
            return;
        }

        setLoading(true);

        setStatus(
            "Uploading statement..."
        );

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {

            toast.error("Please sign in again.");

            setLoading(false);

            return;

        }

        const filePath =
            `${user.id}/${Date.now()}-${file.name}`;

        const {
            error: uploadError,
        } = await supabase.storage
            .from("bank-statements")
            .upload(filePath, file);

        if (uploadError) {

            console.error(uploadError);

            toast.error(uploadError.message);

            setLoading(false);

            return;

        }

        const {
            data: upload,
            error: dbError,
        } = await supabase
            .from("uploads")
            .insert([
                {
                    user_id: user.id,
                    file_name: file.name,
                    file_url: filePath,
                },
            ])
            .select()
            .single();

        if (dbError) {

            console.error(dbError);

            toast.error(dbError.message);

            setLoading(false);

            return;

        }

        // NEW: Real backend processing stage
        setStatus(
            "Analyzing your finances..."
        );

        try {

            await processStatement(
                upload.id
            );

            // NEW: Final processing stage
            setStatus(
                "Preparing insights..."
            );

            // NEW: Success message
            toast.success(
                "Statement analyzed! Opening insights..."
            );

            setFile(null);

            // NEW: Give users a moment to see success
            await new Promise(
                (resolve) =>
                    setTimeout(resolve, 900)
            );

            router.push(
                `/dashboard/insights/${upload.id}`
            );

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to analyze your statement. Please try again."
            );

        } finally {

            setLoading(false);

            setStatus("");

        }
    };

    return (
        <FadeIn>
        <div className="max-w-3xl mx-auto px-6 py-10">

            {/* Header */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold tracking-tight">

                    Upload Statement

                </h1>

                <p className="text-muted-foreground mt-2 text-base">

                    Upload your bank or credit card statement.
                    MoneyLens will automatically extract,
                    categorize, and analyze your spending.

                </p>

            </div>

            {/* Upload Card */}

            <div className="border border-border rounded-2xl p-6 mb-4">

                <h2 className="text-base font-semibold mb-1">

                    Upload PDF Statement

                </h2>

                <p className="text-sm text-muted-foreground mb-5">

                    Supports bank and credit card statements.

                </p>

                {/* NEW: Disable dropzone while processing */}

                <label
                    className={`
                        flex flex-col items-center justify-center gap-3
                        border-2 border-dashed border-border
                        rounded-xl px-6 py-10 mb-4
                        transition-colors
                        ${
                            loading
                                ? "opacity-50 pointer-events-none"
                                : "cursor-pointer hover:bg-muted/40"
                        }
                    `}
                >

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />

                    </svg>

                    <div className="text-center">

                        <p className="text-sm font-medium">

                            {file
                                ? file.name
                                : "Click to choose a file"}

                        </p>

                        <p className="text-xs text-muted-foreground mt-1">

                            PDF only · Bank & credit card statements

                        </p>

                    </div>

                    <input
                        type="file"
                        accept=".pdf"

                        // NEW: Prevent file changes while uploading
                        disabled={loading}

                        className="hidden"

                        onChange={(e) =>
                            setFile(
                                e.target.files?.[0] ?? null
                            )
                        }
                    />

                </label>
                <motion.div
                    whileHover={
                        canAnimate
                            ? { scale: 1.02 }
                            : undefined
                    }
                    whileTap={
                        canAnimate
                            ? { scale: 0.98 }
                            : undefined
                    }
                >
                    <Button
                        onClick={handleUpload}
                        disabled={
                            loading || !file
                        }
                        className="w-full mt-2"
                    >

                        {/* NEW: Spinner + live status */}

                        {loading ? (

                            <div className="flex items-center justify-center gap-2">

                                <div
                                    className="
                                        h-4
                                        w-4
                                        rounded-full
                                        border-2
                                        border-current
                                        border-t-transparent
                                        animate-spin
                                    "
                                />

                                <span>

                                    {status}

                                </span>

                            </div>

                        ) : (

                            "Upload Statement"

                        )}

                    </Button>

                </motion.div>


            </div>

            <div className="mt-8">
                <StatementHistory />
            </div>
            
        </div>
        </FadeIn>
    );
}