export type StatementHistoryItem = {
    id: string;
    file_name: string;
    created_at: string;
    statement_month: string | null;
    transaction_count: number;
};