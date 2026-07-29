"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
    getUploads,
    processStatement,
} from "@/lib/api";

import { useRouter } from "next/navigation";
import StatementHistory from "@/components/dashboard/StatementHistory";

type Upload = {
    id: string;
    file_name: string;
    created_at: string;
};

export default function UploadsPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const router = useRouter();

    const fetchUploads = async () => {
        try {
            const data = await getUploads();
            setUploads(data);
        } catch (error) {
            console.error("Fetch uploads error:", error);
        }
    };

    useEffect(() => {
        fetchUploads();
    }, []);

    const handleUpload = async () => {
        if (!file) {
            alert("Select a file first");
            return;
        }

        setLoading(true);
        setStatus("Uploading statement...");

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("Not logged in");
            setLoading(false);
            return;
        }

        const filePath = `${user.id}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
            .from("bank-statements")
            .upload(filePath, file);

        if (uploadError) {
            console.error(uploadError);
            alert(uploadError.message);
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
            alert(dbError.message);
            setLoading(false);
            return;
        }

        setStatus(
            "Extracting transactions..."
        );

        try {

            await processStatement(
                upload.id
            );

            setStatus(
                "Analysis complete!"
            );

            setFile(null);

            await fetchUploads();

            router.push(
                `/dashboard/insights/${upload.id}`
            );

        }
        catch (error) {

            console.error(error);

            alert(
                "Failed to process statement."
            );

        }
        finally {

            setLoading(false);
            setStatus("");
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Upload Statement
                </h1>
                <p className="text-muted-foreground mt-2 text-base">
                    Upload your bank or credit card statement.
                    MoneyLens will automatically extract, categorize,
                    and analyze your spending.
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

                <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-xl px-6 py-10 cursor-pointer hover:bg-muted/40 transition-colors mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div className="text-center">
                        <p className="text-sm font-medium">
                            {file ? file.name : "Click to choose a file"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            PDF only · Bank & credit card statements
                        </p>
                    </div>
                    <input
                        type="file"
                        accept=".pdf"
                        className="hidden display-none"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                </label>

                <Button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className="w-full mt-2"
                >
                    {loading ? "Processing..." : "Upload Statement"}
                </Button>
                {loading && (
                    <p className="mt-4 text-sm text-center text-muted-foreground">
                        {status}
                    </p>
                )}
            </div>

            <div className="mt-8">
                <StatementHistory />
            </div>

        </div>
    );
}