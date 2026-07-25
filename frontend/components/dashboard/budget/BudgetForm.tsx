"use client";

import { useState } from "react";
import { saveBudget } from "@/lib/api";
import { Button } from "@/components/ui/button";

type Props = {
    month: string | null;
    onBudgetSaved: () => void;
};

const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Education",
    "Entertainment",
];

export default function BudgetForm({
    month,
    onBudgetSaved,
}: Props) {

    const [category, setCategory] =
        useState("Food");

    const [amount, setAmount] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    async function handleSave() {

        const numericAmount =
            Number(amount);

        // Basic validation
        if (
            !numericAmount ||
            numericAmount <= 0
        ) {
            return;
        }

        setSaving(true);

        try {

            if (!month) {
                throw new Error(
                    "Statement month could not be determined"
                );
            }

            // Upsert means:
            //
            // Existing Food budget -> update it
            // No Food budget       -> create it
            //
            // This works because we created the
            // unique(user_id, category) constraint.

            // Save through FastAPI.

            await saveBudget(
                category,
                numericAmount,
                month
            );
            setAmount("");
            // Refresh budget cards.
            await onBudgetSaved();

        } catch (error) {
            console.error(
                "Budget save error:",
                error
            );

        } finally {
            setSaving(false);
        } 
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row">

            {/* Category */}

            <select
                value={category}
                onChange={(e) =>
                    setCategory(
                        e.target.value
                    )
                }
                className="rounded-xl border bg-background px-4 py-2 text-sm"
            >

                {categories.map(
                    (category) => (

                        <option
                            key={category}
                            value={category}
                        >
                            {category}
                        </option>

                    )
                )}

            </select>

            {/* Budget amount */}

            <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) =>
                    setAmount(
                        e.target.value
                    )
                }
                placeholder="Monthly budget"
                className="flex-1 rounded-xl border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />

            <Button
                onClick={handleSave}
                disabled={
                    saving ||
                    !amount ||
                    Number(amount) <= 0
                }
            >
                {saving
                    ? "Saving..."
                    : "Set Budget"}
            </Button>

        </div>
    );
}