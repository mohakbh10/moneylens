"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { supabase } from "@/lib/supabase";
import { getBudgets } from "@/lib/api";
import BudgetCard from "./BudgetCard";
import BudgetForm from "./BudgetForm";

type Transaction = {
    id: string;
    transaction_date: string;
    description: string;
    amount: number;
    transaction_type: string;
    category: string;
};

type Budget = {
    id: string;
    category: string;
    amount: number;
};

type Props = {
    transactions: Transaction[];
};

export default function BudgetPlanner({
    transactions,
}: Props) {

    const [budgets, setBudgets] =
        useState<Budget[]>([]);

    const [loading, setLoading] =
        useState(true);

    // =====================================================
    // Determine which month this statement belongs to
    // =====================================================

    const statementMonth =
        transactions.length > 0
            ? `${transactions
                .map((transaction) =>
                    transaction.transaction_date.slice(0, 7)
                )
                .sort()[0]}-01`
        : null;

    const monthLabel =
        statementMonth
            ? new Date(
                `${statementMonth}T00:00:00`
            ).toLocaleDateString(
                "en-IN",
                {
                    month: "long",
                    year: "numeric",
                }
            )
            : "";
    // =====================================================
    // Fetch budgets belonging to current user
    // =====================================================

    const fetchBudgets =
        useCallback(async () => {

            if (!statementMonth) {
                return;
            }

            setLoading(true);

            try {

                // We still use Supabase Auth to identify
                // the currently logged-in user.
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (!user) {
                    return;
                }

                // Database access now goes through FastAPI.
                const data = await getBudgets(
                    user.id,
                    statementMonth
                );

                setBudgets(data ?? []);

            } catch (error) {

                console.error(
                    "Fetch budgets error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        }, [statementMonth]);

    // Fetch budgets when component loads.
    useEffect(() => {
        fetchBudgets();
    }, [fetchBudgets]);

    // =====================================================
    // Calculate spending for a particular category
    // =====================================================

    function calculateSpent(
        category: string
    ) {

        return transactions

            // Only expenses should count against budgets.
            .filter(
                (transaction) =>
                    transaction.transaction_type
                        .toLowerCase() ===
                        "debit" &&

                    transaction.category ===
                        category
            )

            // Add all matching transactions together.
            .reduce(
                (total, transaction) =>
                    total +
                    Number(
                        transaction.amount
                    ),
                0
            );
    }

    return (
        <div className="mt-8">

            {/* Header */}

            <div className="mb-5">

                <h2 className="text-xl font-semibold">
                    Monthly Budgets
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Set spending limits for {monthLabel}.
                </p>

            </div>

            {/* Add / update budget */}

            <div className="border rounded-2xl bg-card p-5 shadow-sm">
                
                <BudgetForm
                    month={statementMonth}
                    onBudgetSaved={fetchBudgets}
                />

            </div>

            {/* Loading */}

            {loading ? (

                <p className="mt-5 text-sm text-muted-foreground">
                    Loading budgets...
                </p>

            ) : budgets.length === 0 ? (

                // Empty state

                <div className="mt-4 border rounded-2xl p-8 text-center text-sm text-muted-foreground">
                    No budgets yet. Set your first monthly budget above.
                </div>

            ) : (

                // Budget cards

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

                    {budgets.map(
                        (budget) => (

                            <BudgetCard
                                key={
                                    budget.id
                                }
                                category={
                                    budget.category
                                }
                                budget={
                                    Number(
                                        budget.amount
                                    )
                                }
                                spent={
                                    calculateSpent(
                                        budget.category
                                    )
                                }
                            />

                        )
                    )}

                </div>

            )}

        </div>
    );
}