"use client";

type Props = {
    summary: string;
};

export default function AISummaryCard({
    summary,
}: Props) {
    return (
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🤖</span>

                <h2 className="text-xl font-semibold">
                    AI Financial Summary
                </h2>
            </div>

            <p className="text-muted-foreground leading-7 whitespace-pre-wrap">
                {summary}
            </p>
        </div>
    );
}