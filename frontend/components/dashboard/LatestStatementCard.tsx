import React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatStatementMonth } from "@/lib/utils";
import { StatementHistoryItem } from "@/types/statement";

interface Insight {
  total_income: number;
  total_expense: number;
  net_savings: number;
  top_category: string;
  largest_expense: number;
  largest_expense_description: string;
  transaction_count: number;
}

interface LatestStatementCardProps {
  latestStatement: StatementHistoryItem | null;
  latestInsight: Insight | null;
  onViewAnalysis: (id: string) => void;
  onUploadNew: () => void;
}

export default function LatestStatementCard({
  latestStatement,
  latestInsight,
  onViewAnalysis,
  onUploadNew,
}: LatestStatementCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      {latestStatement ? (
        <>
          <h3 className="text-2xl font-semibold">
            {formatStatementMonth(latestStatement.statement_month)}
          </h3>
          <p className="mt-2 text-muted-foreground break-words">{latestStatement.file_name}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Uploaded {new Date(latestStatement.created_at).toLocaleDateString()}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {latestStatement.transaction_count} transactions analyzed
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">Income</p>
              <p className="text-lg font-semibold text-green-600 break-words">
                {formatCurrency(latestInsight?.total_income ?? 0)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">Expense</p>
              <p className="text-lg font-semibold text-red-600 break-words">
                {formatCurrency(latestInsight?.total_expense ?? 0)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">Savings</p>
              <p
                className={`text-lg font-semibold ${
                  (latestInsight?.net_savings ?? 0) >= 0
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {formatCurrency(latestInsight?.net_savings ?? 0)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">Top Category</p>
              <p className="text-lg font-semibold">
                {latestInsight?.top_category ?? "N/A"}
              </p>
            </div>
          </div>

          <Button
            size="lg"
            className="mt-8 w-full"
            onClick={() => onViewAnalysis(latestStatement.id)}
          >
            View Full Analysis →
          </Button>
        </>
      ) : (
        <div className="text-center py-10">
          <Upload size={42} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No statements yet</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Upload your first bank statement to unlock AI-powered insights,
            budgeting and spending analysis.
          </p>
          <Button className="mt-6" onClick={onUploadNew}>
            Upload Statement
          </Button>
        </div>
      )}
    </div>
  );
}
