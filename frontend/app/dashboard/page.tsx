"use client";
import { useRouter } from "next/navigation";
import {
    Upload,
    History,
    Wallet,
    ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
    getStatementHistory,
    getInsights,
} from "@/lib/api";
import type {
    StatementHistoryItem,
} from "@/types/statement";
import { Button } from "@/components/ui/button";
import {
    formatCurrency,
} from "@/lib/utils";

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
type DashboardInsight = {
    total_income: number;
    total_expense: number;
    net_savings: number;
    top_category: string;
};

export default function DashboardPage() {
    const router = useRouter();
    const [latestStatement,setLatestStatement] =useState<StatementHistoryItem | null>(null);
    // NEW: Stores all uploaded statements for homepage preview
    const [statements, setStatements] =
        useState<StatementHistoryItem[]>([]);
    // NEW: Stores AI-generated insights for the latest statement
    const [latestInsight, setLatestInsight] =
        useState<DashboardInsight | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadLatestStatement = async () => {
            try {
                const uploads =
                    await getStatementHistory();
                // Save every statement for Recent Statements section
                setStatements(uploads);
                if (uploads.length > 0) {
                    const latest =
                        uploads[0];
                    setLatestStatement(
                        latest
                    );
                    // Fetch dashboard metrics for latest statement
                    const insight =
                        await getInsights(
                            latest.id
                        );
                    setLatestInsight(
                        insight
                    );
                }
            }
            catch (error) {
                console.error(
                    "Dashboard load error:",
                    error
                );
            }
            finally {
                // Stop loading whether success or failure
                setLoading(false);
            }
        };
        loadLatestStatement();
    }, []);
    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-semibold">
                    Loading dashboard...
                </h2>
            </div>
        );
    }
    return (

        <div className="max-w-6xl mx-auto px-6 py-8">
            {/* ================= Welcome ================= */}
            <div className="mb-10">

                <h1 className="text-3xl font-bold">

                    Welcome back 👋

                </h1>

                <p className="mt-2 text-muted-foreground">
                    Here's an overview of your financial activity.
                </p>
            </div>
            {/* ================= Quick Actions ================= */}

            <h2 className="text-xl font-semibold mb-5">

                Quick Actions

            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/*First Card: Upload Statement */}
                <div
                    onClick={() =>
                        router.push("/dashboard/uploads")
                    }
                    className="
                        rounded-2xl
                        border
                        bg-card
                        p-6
                        cursor-pointer
                        hover:bg-muted/40
                        hover:-translate-y-1
                        hover:shadow-md
                        transition-all
                        duration-200
                    "
                >
                    <div className="flex items-center gap-3 mb-4">

                        <Upload
                            className="text-primary"
                            size={22}
                        />

                        <h3 className="font-semibold">

                            Upload Statement

                        </h3>

                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">

                        Analyze a new bank statement.

                    </p>
                </div>
                {/*Second Card: View Reports */}
                <div
                    onClick={() =>
                        router.push("/dashboard/uploads")
                    }
                    className="
                        rounded-2xl
                        border
                        bg-card
                        p-6
                        cursor-pointer
                        hover:bg-muted/40
                        hover:-translate-y-1
                        hover:shadow-md
                        transition-all
                        duration-200
                    "
                >
                    <div className="flex items-center gap-3 mb-4">

                        <History
                            className="text-primary"
                            size={22}
                        />

                        <h3 className="font-semibold">

                            Statement History

                        </h3>

                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">

                        Browse previous analyses.

                    </p>

                </div>
                {/*Third Card: View Reports */}
                <div
                    onClick={() =>
                        router.push("/dashboard/uploads")
                    }
                    className="
                        rounded-2xl
                        border
                        bg-card
                        p-6
                        cursor-pointer
                        hover:bg-muted/40
                        hover:-translate-y-1
                        hover:shadow-md
                        transition-all
                        duration-200
                    "
                >
                    <div className="flex items-center gap-3 mb-4">

                        <Wallet
                            className="text-primary"
                            size={22}
                        />

                        <h3 className="font-semibold">

                            Budget Planner

                        </h3>

                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">

                        Manage monthly budgets.

                    </p>

                </div>
            </div>
            {/* ================= Latest Statement ================= */}
            <h2 className="text-xl font-semibold mt-10 mb-5">

                Latest Statement

            </h2>
            <div
            className="
            rounded-2xl
            border
            bg-card
            p-6
            "
            >
                {latestStatement ? (
                    <>
                        <h3 className="text-2xl font-semibold">

                            {formatStatementMonth(
                                latestStatement.statement_month
                            )}

                        </h3>
                        <p
                            className="
                                mt-2
                                text-muted-foreground
                            "
                        >

                            {latestStatement.file_name}

                        </p>
                        <p
                            className="
                                mt-3
                                text-sm
                                text-muted-foreground
                            "
                        >

                            {latestStatement.transaction_count}

                            {" "}transactions analyzed

                        </p>
                    {/* Financial Snapshot */}
                    <div
                    className="
                    mt-8
                    grid
                    grid-cols-2
                    gap-4
                    "
                    >
                        <div className="rounded-xl border border-border bg-muted/30 p-4">

                            <p
                                className="
                                    text-xs
                                    text-muted-foreground
                                "
                            >
                                Income
                            </p>
                            <p
                                className="
                                    text-lg
                                    font-semibold
                                    text-green-600
                                "
                            >
                                {formatCurrency(
                                    latestInsight?.total_income ?? 0
                                )}
                            </p>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/30 p-4">

                            <p
                                className="
                                    text-xs
                                    text-muted-foreground
                                "
                            >

                                Expense

                            </p>

                            <p
                                className="
                                    text-lg
                                    font-semibold
                                    text-red-600
                                "
                            >

                                {formatCurrency(
                                    latestInsight?.total_expense ?? 0
                                )}

                            </p>

                        </div>
                        <div className="rounded-xl border border-border bg-muted/30 p-4">

                            <p
                                className="
                                    text-xs
                                    text-muted-foreground
                                "
                            >

                                Savings

                            </p>

                            <p
                                className={`text-lg font-semibold ${
                                (latestInsight?.net_savings ?? 0) >= 0
                                ? "text-green-600"
                                : "text-red-500"
                                }`}
                            >

                                {formatCurrency(
                                    latestInsight?.net_savings ?? 0
                                )}

                            </p>

                        </div>
                        <div className="rounded-xl border border-border bg-muted/30 p-4">

                            <p
                                className="
                                    text-xs
                                    text-muted-foreground
                                "
                            >

                                Top Category

                            </p>

                            <p
                                className="
                                    text-lg
                                    font-semibold
                                "
                            >

                                {latestInsight?.top_category ?? "N/A"}

                            </p>

                        </div>
                    </div>
                    {/* View Insights Button */}
                    <Button

                    className="mt-8"

                    onClick={() =>
                    router.push(
                    `/dashboard/insights/${latestStatement.id}`
                    )
                    }

                    >

                    View Insights →

                    </Button>
                    </>

                ) : (

                    <div className="text-center py-6">

                        <p className="text-lg font-medium">

                            No statements uploaded yet

                        </p>

                        <p className="text-sm text-muted-foreground mt-2">

                            Upload your first bank statement to start tracking your finances.

                        </p>

                    </div>

                )}
                
            </div>
            {/* ================= Recent Statements ================= */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-5">
                    Recent Statements
                </h2>
                <div
                className="
                rounded-2xl
                border
                bg-card
                overflow-hidden
                "
                >
                    {statements.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">

                            No statements uploaded yet.

                        </div>

                    ) : (

                        <>
                            {statements
                                .slice(0, 3)
                                .map((statement) => (
                                    <div key={statement.id}
                                    onClick={() =>
                                    router.push(
                                    `/dashboard/insights/${statement.id}`
                                    )
                                    }

                                    className="
                                    flex
                                    items-center
                                    justify-between
                                    px-5
                                    py-4
                                    border-b
                                    last:border-b-0
                                    cursor-pointer
                                    hover:bg-muted/40
                                    transition
                                    "

                                    >
                                        <div>
                                            <p
                                                className="font-medium"
                                            >

                                                {formatStatementMonth(
                                                    statement.statement_month
                                                )}

                                            </p>
                                            <p
                                            className="
                                            text-sm
                                            text-muted-foreground
                                            "
                                            >

                                                {statement.transaction_count}
                                                {" "}
                                                {statement.transaction_count === 1
                                                ? "transaction"
                                                : "transactions"}
                                            </p>
                                        </div>
                                        <ChevronRight
                                            size={18}
                                            className="text-muted-foreground"
                                        />
                                    </div>
                                ))}

                        </>

                    )}
                    {statements.length > 0 && (
                        <div className="border-t px-5 py-4">
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    router.push("/dashboard/uploads")
                                }
                            >
                                View All Statements →
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );

}