"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { formatCurrency } from "@/lib/utils";

type Transaction = {
    id: string;
    transaction_date: string;
    description: string;
    amount: number;
    transaction_type: string;
    category: string;
};

type Props = {
    transactions: Transaction[];
};

export default function MonthlyTrendChart({
    transactions,
}: Props) {

    // =====================================================
    // 1. Keep only expense/debit transactions
    // =====================================================

    const expenseTransactions =
        transactions.filter(
            (transaction) =>
                transaction.transaction_type.toLowerCase() === "debit"
        );

    // =====================================================
    // 2. Group expenses belonging to the same date
    //
    // Example:
    // June 10 -> ₹200 + ₹300 = ₹500
    // =====================================================

    const expensesByDate:
        Record<string, number> = {};

    expenseTransactions.forEach(
        (transaction) => {

            const date =
                transaction.transaction_date;

            expensesByDate[date] =
                (expensesByDate[date] || 0) +
                Number(transaction.amount);

        }
    );

    // =====================================================
    // 3. Convert grouped object into data Recharts can use
    // =====================================================

    const chartData = Object.entries(
        expensesByDate
    )
        .sort(
            ([dateA], [dateB]) =>
                new Date(dateA).getTime() -
                new Date(dateB).getTime()
        )
        .map(([date, expense]) => ({
            date: new Date(date).toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                }
            ),

            expense,
        }));

    // =====================================================
    // Empty state
    // =====================================================

    if (chartData.length === 0) {

        return (

            <div className="border rounded-2xl bg-card p-5 shadow-sm">

                <h2 className="text-lg font-semibold">
                    Spending Trend
                </h2>

                <p className="mt-6 text-sm text-muted-foreground">
                    No expense data available.
                </p>

            </div>

        );

    }

    return (

        <div className="border rounded-2xl bg-card p-5 shadow-sm">

            {/* Chart Header */}

            <div className="mb-5">

                <h2 className="text-lg font-semibold">
                    Spending Trend
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                    Your daily expenses throughout this statement.
                </p>

            </div>

            {/* Chart */}

            <div className="h-72 w-full">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart data={chartData}>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                        />

                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                            tickFormatter={(value) =>
                                `₹${value}`
                            }
                        />

                        <Tooltip
                            formatter={(value) => [
                                formatCurrency(
                                    Number(value)
                                ),
                                "Expense",
                            ]}
                        />

                        <Line
                            type="monotone"
                            dataKey="expense"
                            stroke="currentColor"
                            strokeWidth={2}
                            dot={{
                                r: 3,
                            }}
                            activeDot={{
                                r: 5,
                            }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>

    );
}