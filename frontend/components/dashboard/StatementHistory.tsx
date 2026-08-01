"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FileText,
    ChevronRight,
    Trash2,
} from "lucide-react";

import {
    getStatementHistory,
    deleteStatement,
} from "@/lib/api";

import type {
    StatementHistoryItem,
} from "@/types/statement";
import { Button } from "../ui/button";


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
    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const loadUploads = async () => {

            try {

                const data =
                    await getStatementHistory();

                setUploads(data);

            }
            catch (error) {

                console.error(
                    "Failed to load statement history:",
                    error
                );

            }
            finally {

                setLoading(false);

            }

        };

        loadUploads();

    }, []);

    if (loading) {
        return (
            <div className="border rounded-2xl bg-card p-6">
                <div className="space-y-4">
                    {[1,2,3].map((item) => (
                        <div
                            key={item}
                            className="
                                h-16
                                rounded-xl
                                bg-muted
                                animate-pulse
                            "
                        />
                    ))}
                </div>
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

        }
        catch (error) {

            console.error(
                "Delete statement error:",
                error
            );

        }
        finally {

            setDeletingId(null);

        }

    }
    return (

        <div className="border rounded-2xl bg-card overflow-hidden">

            <div className="px-5 py-4 border-b">

                <h2 className="text-lg font-semibold">
                    Your Statements
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                    Browse previously analyzed bank statements.
                </p>

            </div>

            {uploads.length === 0 ? (
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
                    {uploads.map((upload) => (
                        <div
                            key={upload.id}
                            className="
                                flex
                                items-center
                                gap-3
                                px-5
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
                                onClick={() =>
                                    router.push(
                                        `/dashboard/insights/${upload.id}`
                                    )
                                }
                                className="
                                    flex
                                    flex-1
                                    min-w-0
                                    items-center
                                    justify-between
                                    text-left
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

                                        <div className="flex items-center gap-2">

                                            <p className="font-semibold">

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

                        </div>

                    ))}
                </div>

            )}

        </div>

    );

}