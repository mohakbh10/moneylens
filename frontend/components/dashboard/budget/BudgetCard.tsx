import { formatCurrency } from "@/lib/utils";

type Props = {
    category: string;
    budget: number;
    spent: number;
};

export default function BudgetCard({
    category,
    budget,
    spent,
}: Props) {

    // Calculate how much of the budget has been used.
    const percentage =
        budget > 0
            ? (spent / budget) * 100
            : 0;

    // Progress bar should never visually exceed 100%.
    const progress =
        Math.min(percentage, 100);

    const remaining =
        budget - spent;

    const overBudget =
        spent > budget;

    return (
        <div className="border rounded-2xl bg-card p-5 shadow-sm">

            {/* Category + percentage */}
            <div className="flex items-center justify-between">

                <h3 className="font-semibold">
                    {category}
                </h3>

                <span className="text-sm text-muted-foreground">
                    {Math.round(percentage)}%
                </span>

            </div>

            {/* Amount spent */}
            <div className="mt-3">

                <span className="text-lg font-semibold">
                    {formatCurrency(spent)}
                </span>

                <span className="text-sm text-muted-foreground">
                    {" "}of {formatCurrency(budget)}
                </span>

            </div>

            {/* Progress bar */}
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">

                <div
                    className={`h-full rounded-full transition-all ${
                        overBudget
                            ? "bg-red-500"
                            : percentage >= 80
                            ? "bg-orange-500"
                            : "bg-green-500"
                    }`}
                    style={{
                        width: `${progress}%`,
                    }}
                />

            </div>

            {/* Budget status */}
            <p
                className={`mt-3 text-sm ${
                    overBudget
                        ? "text-red-500"
                        : "text-muted-foreground"
                }`}
            >

                {overBudget
                    ? `${formatCurrency(
                            Math.abs(remaining)
                    )} over budget`
                    : `${formatCurrency(
                            remaining
                    )} remaining`}

            </p>

        </div>
    );
}