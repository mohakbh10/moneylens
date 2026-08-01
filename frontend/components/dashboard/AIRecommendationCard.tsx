import { Lightbulb } from "lucide-react";

type Props = {
    recommendations: string;
};

export default function AIRecommendationCard({
    recommendations,
}: Props) {

    const items =
        recommendations
            .split("\n")
            .filter(item => item.trim());
    const hasRecommendations = items.length > 0;
    return (

        <div className="bg-card border rounded-2xl p-6 shadow-sm">

            <h2 className="text-xl font-semibold flex items-center gap-2 mb-5">

                <Lightbulb
                    className="text-yellow-500"
                    size={22}
                />

                AI Recommendations

            </h2>
                {hasRecommendations ? (
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="flex gap-3"
                            >
                                <div className="mt-1 h-2 w-2 rounded-full bg-yellow-500" />
                                <p className="text-sm leading-7">
                                    {item.replace(/^[*•-]\s*/, "")}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        className="
                            rounded-xl
                            border
                            border-dashed
                            p-6
                            text-center
                            text-muted-foreground
                        "
                    >
                        No personalized recommendations are available yet.
                    </div>
                )}
        </div>

    );

}