"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

type Upload = {
    id: string;
    file_name: string;
    created_at: string;
};

export default function UploadsPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [loading, setLoading] = useState(false);

    // 🔹 Fetch uploads
    const fetchUploads = async () => {
        const { data, error } = await supabase
        .from("uploads")
        .select("*")
        .order("created_at", { ascending: false });

        if (error) {
        console.error("Fetch error:", error);
        return;
        }

        setUploads(data || []);
    };

    useEffect(() => {
        (async () => {
            await fetchUploads();
        })();
    }, []);

    const handleUpload = async () => {
        if (!file) {
        alert("Select a file first");
        return;
        }

        setLoading(true);

        const {
        data: { user },
        } = await supabase.auth.getUser();

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

        const { error: dbError } = await supabase
        .from("uploads")
        .insert([
            {
            user_id: user.id,
            file_name: file.name,
            file_url: filePath,
            },
        ]);

        if (dbError) {
        console.error(dbError);
        alert(dbError.message);
        setLoading(false);
        return;
        }

        alert("Upload successful!");
        setFile(null);
        fetchUploads(); // 🔥 refresh list
        setLoading(false);
    };

    return (
        <div className="space-y-8">
        <h1 className="text-2xl font-bold">Upload Bank Statement</h1>

        <div className="space-y-4">
            <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
            </Button>
        </div>

        <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4">Your Uploads</h2>

            <div className="space-y-3">
            {uploads.length === 0 && (
                <p className="text-muted-foreground">No uploads yet.</p>
            )}

            {uploads.map((upload) => (
                <div
                key={upload.id}
                className="border p-4 rounded-xl shadow-sm"
                >
                <p className="font-medium">{upload.file_name}</p>
                <p className="text-sm text-muted-foreground">
                    {new Date(upload.created_at).toLocaleString()}
                </p>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
}