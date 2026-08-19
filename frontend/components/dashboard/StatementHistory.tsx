"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FileText,
    ChevronRight,
    Trash2,
} from "lucide-react";

import {
    getStatementHistory,
    deleteStatement,
    processStatement,
} from "@/lib/api";

import type {
    StatementHistoryItem,
} from "@/types/statement";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { motion } from "framer-motion";
import { toast } from "sonner";

function formatStatementMonth(
    month: string | null
) {
    if (!month) {
        return "Unknown period";
    }
    const [year, monthNumber] =
        month.split("-");
    const date = new Date(
        Number(year),
        Number(monthNumber) - 1
    );
    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            year: "numeric",
        }
    );
}
export default function StatementHistory() {
    const router = useRouter();
    const [uploads, setUploads] = useState<StatementHistoryItem[]>([]);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [loading, setLoading] =
        useState(true);
    const [error, setError] = useState("");

    const loadUploads = useCallback(async () => {

        setLoading(true);
        setError("");

            try {

                const data =
                    await getStatementHistory();

                setUploads(data);

            }
            catch {

                console.error("Failed to load statement history");
                setError("Unable to load your statements. Please try again.");

            }
            finally {

                setLoading(false);

            }

    }, []);

    useEffect(() => {
        loadUploads();
    }, [loadUploads]);

    if (loading) {
        return (
            <div
                className="
                    border
                    rounded-2xl
                    bg-card
                    overflow-hidden
                "
            >
                {/* Header */}

                <div className="px-4 sm:px-5 py-4 border-b">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-72 mt-3" />
                </div>
                {/* Statement Rows */}
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="
                            flex
                            items-center
                            justify-between
                            px-4 sm:px-5
                            py-4
                            border-b
                        "
                    >

                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-56" />
                                <Skeleton className="h-3 w-24" />

                            </div>
                        </div>
                        <Skeleton className="h-5 w-5 rounded-full" />
                    </div>

                ))}

            </div>

        );

    }
    async function handleDelete(
        uploadId: string
    ) {

        const confirmed =
            window.confirm(
                "Delete this statement and all of its analysis? This cannot be undone."
            );

        if (!confirmed) return;

        try {

            setDeletingId(uploadId);

            await deleteStatement(
                uploadId
            );

            setUploads((current) =>
                current.filter(
                    (upload) =>
                        upload.id !== uploadId
                )
            );
            toast.success("Statement deleted.");

        }
        catch {

            console.error("Failed to delete statement");
            toast.error("Unable to delete this statement. Please try again.");

        }
        finally {

            setDeletingId(null);

        }

    }
    async function handleRetry(uploadId: string) {
        try {
            setProcessingId(uploadId);
            await processStatement(uploadId);
            toast.success("Statement analyzed successfully.");
            await loadUploads();
        } catch {
            console.error("Failed to process statement");
            toast.error("Unable to analyze this statement. Please try again.");
        } finally {
            setProcessingId(null);
        }
    }
    return (
        <div className="border rounded-2xl bg-card overflow-hidden">

            <div className="px-4 sm:px-5 py-4 border-b">

                <h2 className="text-lg font-semibold">
                    Your Statements
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                    Browse previously analyzed bank statements.
                </p>

            </div>

            {error ? (
                <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button className="mt-4" variant="outline" onClick={loadUploads}>
                        Try again
                    </Button>
                </div>
            ) : uploads.length === 0 ? (
                <div className="p-12 text-center">
                    <div
                        className="
                            mx-auto
                            mb-5
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-full
                            bg-muted
                        "
                    >
                        <FileText
                            size={30}
                            className="text-muted-foreground"
                        />
                    </div>
                    <h3 className="text-lg font-semibold">
                        No statements uploaded
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Upload your first bank statement to unlock
                        AI insights, budgeting and spending analytics.
                    </p>
                    {/* NEW: Quick CTA for first-time users */}
                    <Button
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            })
                        }
                        className="mt-6"
                    >
                        Upload Statement
                    </Button>
                </div>
            ) : (

                <div>
                    {uploads.map((upload,index) => (
                        <motion.div
                            key={upload.id}
                            initial={{
                                opacity: 0,
                                y: 8,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: index * 0.06,
                            }}
                            className="
                                flex
                                items-center
                                gap-3
                                px-4 sm:px-5
                                py-4
                                border-b
                                last:border-b-0
                                hover:bg-muted/40
                                hover:scale-[1.01]
                                transition
                            "
                        >

                            {/* Clickable statement area */}

                            <button
                                onClick={() => {
                                    if (upload.transaction_count > 0) {
                                        router.push(`/dashboard/insights/${upload.id}`);
                                    }
                                }}
                                disabled={upload.transaction_count === 0}
                                className="
                                    flex
                                    flex-1
                                    min-w-0
                                    items-center
                                    justify-between
                                    text-left
                                    disabled:cursor-default
                                "
                            >

                                <div className="flex items-center gap-3 min-w-0">

                                    {/* File icon */}

                                    <div
                                        className="
                                            h-12
                                            w-12
                                            shrink-0
                                            rounded-xl
                                            bg-muted
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >
                                        <FileText size={18} />
                                    </div>


                                    {/* Statement information */}

                                    <div className="min-w-0">

                                        <div className="flex flex-wrap items-center gap-2">

                                            <p className="font-semibold break-words">

                                                {formatStatementMonth(
                                                    upload.statement_month
                                                )}

                                            </p>

                                            {upload.transaction_count > 0 ? (

                                                <span
                                                    className="
                                                        rounded-full
                                                        bg-green-100
                                                        px-2
                                                        py-0.5
                                                        text-xs
                                                        font-medium
                                                        text-green-700
                                                    "
                                                >
                                                    Analyzed
                                                </span>

                                            ) : (

                                                <span
                                                    className="
                                                        rounded-full
                                                        bg-yellow-100
                                                        px-2
                                                        py-0.5
                                                        text-xs
                                                        font-medium
                                                        text-yellow-700
                                                    "
                                                >
                                                    Pending
                                                </span>

                                            )}

                                        </div>

                                        <p
                                            className="
                                                mt-1
                                                truncate
                                                text-sm
                                                text-muted-foreground
                                            "
                                        >
                                            {upload.file_name}
                                        </p>

                                        <p
                                        className="
                                        mt-1
                                        text-xs
                                        text-muted-foreground
                                        "
                                        >
                                        {upload.transaction_count} transaction
                                        {upload.transaction_count !== 1 && "s"}
                                        </p>
                                        <p
                                        className="
                                        text-xs
                                        text-muted-foreground
                                        "
                                        >

                                        Uploaded{" "}

                                        {new Date(
                                        upload.created_at
                                        ).toLocaleDateString()}

                                        </p>
                                    </div>

                                </div>


                                <ChevronRight
                                    size={18}
                                    className="
                                        ml-4
                                        shrink-0
                                        text-muted-foreground
                                    "
                                />

                            </button>

                            {upload.transaction_count === 0 && (
                                <Button
                                    size="sm"
                                    onClick={() => handleRetry(upload.id)}
                                    disabled={processingId === upload.id || deletingId === upload.id}
                                >
                                    {processingId === upload.id ? "Analyzing..." : "Analyze"}
                                </Button>
                            )}


                            {/* Delete */}

                            <button
                                onClick={() =>
                                    handleDelete(upload.id)
                                }
                                disabled={
                                    deletingId === upload.id
                                }
                                className="
                                    shrink-0
                                    rounded-lg
                                    p-2
                                    text-muted-foreground
                                    hover:bg-red-50
                                    hover:text-red-600
                                    transition
                                    disabled:opacity-50
                                "
                                aria-label="Delete statement"
                            >

                                <Trash2 size={17} />

                            </button>

                        </motion.div>

                    ))}
                </div>

            )}

        </div>
    );

}
