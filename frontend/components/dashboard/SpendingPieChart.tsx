"use client";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type Transaction = {
    category: string;
    amount: number;
    transaction_type: string;
};

const COLORS = [
    "#469b88",
    "#377cc8",
    "#e78c9d",
    "#eed868",
    "#e0533d",
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
];

type Props = {
    transactions: Transaction[];
};

export default function SpendingPieChart({
    transactions,
}: Props) {

    // Group only debit transactions
    const categoryTotals: Record<string, number> = {};

    transactions
        .filter(
            (t) =>
                t.transaction_type.toLowerCase() ===
                "debit"
        )
        .forEach((transaction) => {

            const category =
                transaction.category || "Other";

            categoryTotals[category] =
                (categoryTotals[category] || 0) +
                transaction.amount;

        });

    const data = Object.entries(categoryTotals).map(
        ([name, value]) => ({
            name,
            value,
        })
    );

    return (

        <div className="bg-card border rounded-2xl p-6 shadow-sm">

            <h2 className="text-xl font-semibold mb-6">

                Spending by Category

            </h2>

            <div className="h-80">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={110}
                            label
                        >

                            {data.map((_, index) => (

                                <Cell
                                    key={index}
                                    fill={
                                        COLORS[
                                            index %
                                                COLORS.length
                                        ]
                                    }
                                />

                            ))}

                        </Pie>

                        <Tooltip />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}