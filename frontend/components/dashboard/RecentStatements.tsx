import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatStatementMonth } from "@/lib/utils";
import { StatementHistoryItem } from "@/types/statement";

interface RecentStatementsProps {
  statements: StatementHistoryItem[];
  onViewAll: () => void;
  onViewStatement: (id: string) => void;
}

export default function RecentStatements({
  statements,
  onViewAll,
  onViewStatement,
}: RecentStatementsProps) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-5">Recent Statements</h2>
      <div className="rounded-2xl border bg-card overflow-hidden">
        {statements.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No statements uploaded yet.
          </div>
        ) : (
          <>
            {statements.slice(0, 3).map((statement) => (
              <div
                key={statement.id}
                onClick={() => onViewStatement(statement.id)}
                className="
                  flex
                  items-center
                  justify-between
                  px-5
                  py-4
                  border-b
                  last:border-b-0
                  cursor-pointer
                  hover:bg-muted/40
                  transition
                "
              >
                <div>
                  <p className="font-medium">
                    {formatStatementMonth(statement.statement_month)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {statement.transaction_count}{" "}
                    {statement.transaction_count === 1
                      ? "transaction"
                      : "transactions"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {statement.file_name}
                  </p>
                </div>
                <ChevronRight size={18} className="text-muted-foreground" />
              </div>
            ))}
          </>
        )}
        {statements.length > 0 && (
          <div className="border-border px-5 py-4 flex justify-end">
            <Button variant="ghost" onClick={onViewAll}>
              View All Statements →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
