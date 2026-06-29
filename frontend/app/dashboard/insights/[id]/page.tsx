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

            {/* ========================= */}
            {/* Transactions */}
            {/* We'll build this next */}
            {/* ========================= */}

        </div>

    );

}