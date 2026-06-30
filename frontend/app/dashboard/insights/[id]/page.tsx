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
import SpendingPieChart from "@/components/dashboard/SpendingPieChart";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import { categoryColors } from "@/lib/constants";
import AISummaryCard from "@/components/dashboard/AISummaryCard";

import {
    getAISummary,
} from "@/lib/api";

import FloatingChat from "@/components/dashboard/chat/FloatingChat";

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

    const [summary, setSummary] =useState("");
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
                const summaryData =
                    await getAISummary(id as string);

                
                setInsight(insightData);

                setTransactions(transactionData);

                setSummary(summaryData.summary);

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

        <div className="max-w-5xl mx-auto px-6 py-5">

            {/* ========================= */}
            {/* Header */}
            {/* ========================= */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold">

                    Statement Insights

                </h1>

                <p className="text-muted-foreground mt-1">

                    AI-powered analysis of your uploaded bank statement.

                </p>

            </div>

            {/* ========================= */}
            {/* KPI Cards */}
            {/* ========================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                {/* Income */}

                <div className="bg-card border rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-muted-foreground">
                            Total Income
                        </p>

                        <IndianRupee
                            size={20}
                            className="text-green-600"
                        />

                    </div>

                    <h2 className="text-2xl font-bold mt-3 text-green-600">

                        {formatCurrency(
                            insight.total_income
                        )}

                    </h2>

                </div>

                {/* Expense */}

                <div className="bg-card border rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-muted-foreground">
                            Total Expense
                        </p>

                        <Wallet
                            size={20}
                            className="text-red-500"
                        />

                    </div>

                    <h2 className="text-2xl font-bold mt-3 text-red-500">

                        {formatCurrency(
                            insight.total_expense
                        )}

                    </h2>

                </div>

                {/* Savings */}

                <div className="bg-card border rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-muted-foreground">
                            Net Savings
                        </p>

                        <TrendingUp size={20} />

                    </div>

                    <h2
                        className={`text-2xl font-bold mt-3 ${
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

                <div className="bg-card border rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-muted-foreground">
                            Transactions
                        </p>

                        <Receipt size={20} />

                    </div>

                    <h2 className="text-2xl font-bold mt-3">

                        {insight.transaction_count}

                    </h2>

                </div>

            </div>
            {/* ================= Insights AI Summary ================= */}
            {summary && (
                <div className="mt-8">
                    <AISummaryCard
                        summary={summary}
                    />
                </div>
            )}

            {/* ========================= */}
            {/* Spending Overview */}
            {/* ========================= */}

            <div className="mt-7 mb-5">

                <h2 className="text-xl font-semibold">

                    Spending Overview

                </h2>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Top Category */}

                <div className="bg-card border rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-muted-foreground">

                            Top Spending Category

                        </p>

                        <PieChart size={20} />

                    </div>

                    <h2 className="text-2xl font-semibold mt-3">

                        {insight.top_category}

                    </h2>

                </div>

                {/* Largest Expense */}

                <div className="bg-card border rounded-2xl p-5 shadow-sm">

                    <p className="text-sm text-muted-foreground">

                        Largest Expense

                    </p>

                    <h2 className="text-2xl font-bold mt-3">

                        {formatCurrency(
                            insight.largest_expense
                        )}

                    </h2>

                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">

                        {insight.largest_expense_description}

                    </p>

                </div>

            </div>
            {/* ================= Charts ================= */}
            <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">

                <SpendingPieChart
                    transactions={transactions}
                />

                <IncomeExpenseChart
                    income={insight.total_income}
                    expense={insight.total_expense}
                />
            </div>
            
            <div className="mt-10">
                <FloatingChat uploadId={id as string}/>
            </div>
            {/* ================= Transactions ================= */}

            <div className="mt-8">

                <h2 className="text-xl font-semibold mb-5">
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

                                        <th className="px-4 py-3 text-sm">
                                            Date
                                        </th>

                                        <th className="px-4 py-3 text-sm">
                                            Description
                                        </th>

                                        <th className="px-4 py-3 text-sm">
                                            Category
                                        </th>

                                        <th className="px-4 py-3 text-right text-sm">
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

                                            <td className="px-4 py-3 max-w-xs truncate">

                                                {new Date(
                                                    transaction.transaction_date
                                                ).toLocaleDateString()}

                                            </td>

                                            <td className="px-4 py-3 max-w-sm truncate">

                                                {transaction.description}

                                            </td>

                                            <td className="px-4 py-3">
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
                                                className={`px-4 py-3 text-right font-semibold ${
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
                    <div className="flex items-center justify-between px-4 py-3 border-t bg-card">
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