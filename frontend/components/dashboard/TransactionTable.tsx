import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { categoryColors } from "@/lib/constants";

interface Transaction {
  id: string;
  transaction_date: string;
  description: string;
  amount: number;
  transaction_type: string;
  category: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({
  transactions,
}: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentTransactions = transactions.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const emptyRows = rowsPerPage - currentTransactions.length;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-5">Recent Transactions</h2>

      <div className="border rounded-2xl bg-card overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No transactions found.
          </div>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-muted z-10">
              <tr className="text-left">
                <th className="px-4 py-3 text-sm">Date</th>
                <th className="px-4 py-3 text-sm">Description</th>
                <th className="px-4 py-3 text-sm">Category</th>
                <th className="px-4 py-3 text-right text-sm">Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-t hover:bg-muted/30 transition-colors duration-200"
                >
                  <td className="px-4 py-3 max-w-xs truncate">
                    {new Date(transaction.transaction_date).toLocaleDateString()}
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
                          categoryColors[transaction.category] ??
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
                    {transaction.transaction_type === "debit" ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
              {/* Empty rows to maintain table height */}
              {Array.from({ length: emptyRows }).map((_, index) => (
                <tr key={`empty-${index}`} className="border-t h-14">
                  <td colSpan={4}></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Page navigation for transactions */}
        {transactions.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-card">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}–
              {Math.min(startIndex + rowsPerPage, transactions.length)} of{" "}
              {transactions.length}
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
        )}
      </div>
    </div>
  );
}
