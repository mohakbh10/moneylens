"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    IndianRupee,
    Wallet,
    TrendingUp,
    Receipt,
    PieChart,
} from "lucide-react";

import {
    getInsights,
    getTransactions,
} from "@/lib/api";

import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Insight = {
    total_income: number;
    total_expense: number;
    net_savings: number;
    top_category: string;
    largest_expense: number;
    largest_expense_description: string;
    transaction_count: number;
};

type Transaction = {
    id: string;
    transaction_date: string;
    description: string;
    amount: number;
    transaction_type: string;
    category: string;
};
const categoryColors = {
        Food: "bg-orange-100 text-orange-700",
        Shopping: "bg-pink-100 text-pink-700",
        Transport: "bg-blue-100 text-blue-700",
        Bills: "bg-yellow-100 text-yellow-700",
        Entertainment: "bg-purple-100 text-purple-700",
        Income: "bg-green-100 text-green-700",
        Transfer: "bg-sky-100 text-sky-700",
        Education: "bg-indigo-100 text-indigo-700",
    };
export default function InsightsPage() {
    const { id } = useParams();

    const [insight, setInsight] =
        useState<Insight | null>(null);

    const [transactions, setTransactions] =
        useState<Transaction[]>([]);

    const [loading, setLoading] =
        useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const rowsPerPage = 5;
    // =========================
    // Load insight + transactions
    // =========================
    useEffect(() => {

        const load = async () => {

            try {

                const insightData =
                    await getInsights(id as string);

                const transactionData =
                    await getTransactions(id as string);

                setInsight(insightData);

                setTransactions(transactionData);

            }
            catch (error) {

                console.error(error);

            }
            finally {

                setLoading(false);

            }

        };

        if (id) {
            load();
        }

    }, [id]);

    // =========================
    // Loading State
    // =========================
    if (loading) {

        return (

            <div className="max-w-6xl mx-auto px-6 py-12">

                <h2 className="text-2xl font-semibold">

                    Loading insights...

                </h2>

            </div>

        );

    }

    // =========================
    // Error State
    // =========================
    if (!insight) {

        return (

            <div className="max-w-6xl mx-auto px-6 py-12">

                <h2 className="text-2xl font-semibold">

                    Insight not found.

                </h2>

            </div>

        );

    }
    const totalPages = Math.ceil(
        transactions.length / rowsPerPage
    );

    const startIndex =
        (currentPage - 1) * rowsPerPage;

    const currentTransactions =
        transactions.slice(
            startIndex,
            startIndex + rowsPerPage
        );
    const emptyRows = rowsPerPage - currentTransactions.length;
    return (

        <div className="max-w-6xl mx-auto px-6 py-10">

            {/* ========================= */}
            {/* Header */}
            {/* ========================= */}

            <div className="mb-10">

                <h1 className="text-4xl font-bold">

                    Statement Insights

                </h1>

                <p className="text-muted-foreground mt-2">

                    AI-powered analysis of your uploaded bank statement.

                </p>

            </div>

            {/* ========================= */}
            {/* KPI Cards */}
            {/* ========================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                {/* Income */}

                <div className="bg-card border rounded-2xl p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-muted-foreground">
                            Total Income
                        </p>

                        <IndianRupee
                            size={20}
                            className="text-green-600"
                        />

                    </div>

                    <h2 className="text-3xl font-bold mt-4 text-green-600">

                        {formatCurrency(
                            insight.total_income
                        )}

                    </h2>

                </div>

                {/* Expense */}

                <div className="bg-card border rounded-2xl p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-muted-foreground">
                            Total Expense
                        </p>

                        <Wallet
                            size={20}
                            className="text-red-500"
                        />

                    </div>

                    <h2 className="text-3xl font-bold mt-4 text-red-500">

                        {formatCurrency(
                            insight.total_expense
                        )}

                    </h2>

                </div>

                {/* Savings */}

                <div className="bg-card border rounded-2xl p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-muted-foreground">
                            Net Savings
                        </p>

                        <TrendingUp size={20} />

                    </div>

                    <h2
                        className={`text-3xl font-bold mt-4 ${
                            insight.net_savings >= 0
                                ? "text-green-600"
                                : "text-red-500"
                        }`}
                    >

                        {formatCurrency(
                            insight.net_savings
                        )}

                    </h2>

                </div>

                {/* Count */}

                <div className="bg-card border rounded-2xl p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-muted-foreground">
                            Transactions
                        </p>

                        <Receipt size={20} />

                    </div>

                    <h2 className="text-3xl font-bold mt-4">

                        {insight.transaction_count}

                    </h2>

                </div>

            </div>

            {/* ========================= */}
            {/* Spending Overview */}
            {/* ========================= */}

            <div className="mt-10 mb-5">

                <h2 className="text-2xl font-semibold">

                    Spending Overview

                </h2>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Top Category */}

                <div className="bg-card border rounded-2xl p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-muted-foreground">

                            Top Spending Category

                        </p>

                        <PieChart size={20} />

                    </div>

                    <h2 className="text-2xl font-semibold mt-4">

                        {insight.top_category}

                    </h2>

                </div>

                {/* Largest Expense */}

                <div className="bg-card border rounded-2xl p-6 shadow-sm">

                    <p className="text-sm text-muted-foreground">

                        Largest Expense

                    </p>

                    <h2 className="text-3xl font-bold mt-4">

                        {formatCurrency(
                            insight.largest_expense
                        )}

                    </h2>

                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">

                        {insight.largest_expense_description}

                    </p>

                </div>

            </div>
            {/* ================= Transactions ================= */}

            <div className="mt-10">

                <h2 className="text-2xl font-semibold mb-5">
                    Recent Transactions
                </h2>

                <div className="border rounded-2xl bg-card overflow-hidden">
                    {transactions.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        No transactions found.
                    </div>
                    ) : (
                            <table className="w-full">

                                <thead className="sticky top-0 bg-muted z-10">

                                    <tr className="text-left">

                                        <th className="px-5 py-4 text-sm">
                                            Date
                                        </th>

                                        <th className="px-5 py-4 text-sm">
                                            Description
                                        </th>

                                        <th className="px-5 py-4 text-sm">
                                            Category
                                        </th>

                                        <th className="px-5 py-4 text-right text-sm">
                                            Amount
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {currentTransactions.map((transaction) => (

                                        <tr
                                            key={transaction.id}
                                            className="border-t hover:bg-muted/30 transition-colors duration-200"
                                        >

                                            <td className="px-5 py-4 max-w-xs truncate">

                                                {new Date(
                                                    transaction.transaction_date
                                                ).toLocaleDateString()}

                                            </td>

                                            <td className="px-5 py-4 max-w-sm truncate">

                                                {transaction.description}

                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`
                                                        rounded-full
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        ${
                                                            categoryColors[transaction.category]
                                                            ??
                                                            "bg-muted text-muted-foreground"
                                                        }
                                                    `}
                                                >
                                                    {transaction.category}
                                                </span>

                                            </td>

                                            <td
                                                className={`px-5 py-4 text-right font-semibold ${
                                                    transaction.transaction_type === "debit"
                                                        ? "text-red-500"
                                                        : "text-green-600"
                                                }`}
                                            >

                                                {transaction.transaction_type === "debit"
                                                    ? "-"
                                                    : "+"}

                                                {formatCurrency(
                                                    transaction.amount
                                                )}

                                            </td>

                                        </tr>

                                    ))}
                                    {/* Empty rows to maintain table height */}
                                        {Array.from({ length: emptyRows }).map((_, index) => (
                                            <tr
                                                key={`empty-${index}`}
                                                className="border-t h-14"
                                            >
                                                <td colSpan={4}></td>
                                            </tr>
                                        ))}

                                </tbody>
                            </table>
                            
                    )}           
                    {/* Page navigation for transactions */}
                    <div className="flex items-center justify-between px-5 py-4 border-t bg-card">
                        <p className="text-sm text-muted-foreground">

                            Showing {startIndex + 1}–
                            {Math.min(
                                startIndex + rowsPerPage,
                                transactions.length
                            )} of {transactions.length}

                        </p>

                        <div className="flex items-center gap-2">

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => {
                                    setCurrentPage(currentPage - 1);
                                    window.scrollTo({
                                        top: 650,
                                        behavior: "smooth",
                                    });
                                }}
                            >
                                Previous
                            </Button>

                            <span className="text-sm">

                                Page {currentPage} of {totalPages}

                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() => {
                                    setCurrentPage(currentPage + 1);
                                    window.scrollTo({
                                        top: 650,
                                        behavior: "smooth",
                                    });
                                }}
                            >
                                Next
                            </Button>

                        </div>

                    </div>
                </div>

            </div>
        </div>

    );

}