"use client";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

type Props = {
    income: number;
    expense: number;
};

export default function IncomeExpenseChart({
    income,
    expense,
}: Props) {

    const data = [
        {
            name: "Income",
            amount: income,
        },
        {
            name: "Expense",
            amount: expense,
        },
    ];

    return (
        <div className="bg-card border rounded-2xl p-4 sm:p-6 shadow-sm">

            <h2 className="text-xl font-semibold mb-6">
                Income vs Expense
            </h2>

            <div className="h-64 sm:h-80">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <BarChart data={data} margin={{ left: 0, right: 8 }}>

                        <XAxis dataKey="name" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="amount"
                            radius={[8, 8, 0, 0]}
                            fill="#d28a8c"
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}
