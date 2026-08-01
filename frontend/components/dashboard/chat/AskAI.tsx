"use client";

import { askAI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import ChatBubble from "./ChatBubble";
import { useState, useEffect, useRef } from "react";
import TypingIndicator from "./TypingIndicator";

type Props = {
    uploadId: string;
};

type Message = {
    role: "user" | "assistant";
    text: string;
};

export default function AskAI({
    uploadId,
}: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [question, setQuestion] = useState("");

    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            text:
                "Hi! 👋 I've analyzed your statement. Ask me anything about your spending, savings, transactions, or financial habits.",
        },
    ]);

    const suggestions = [
    "How can I improve my savings?",
    "Where am I overspending?",
    "What spending habits stand out?",
    "Did I make any unusual purchases?",
    "Give me personalized financial advice.",
    ];
    const loadingMessages = [
        "Analyzing transactions...",
        "Reviewing spending patterns...",
        "Finding saving opportunities...",
        "Preparing financial advice...",
        "Looking for unusual purchases...",
    ];
    const [loadingText, setLoadingText] = useState("");

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages]);

    async function handleAsk() {

        if (!question.trim()) return;

        const currentQuestion = question;

        // Add user's message
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                text: currentQuestion,
            },
        ]);

        setQuestion("");
        setLoading(true);
        setLoadingText(
            loadingMessages[
                Math.floor(
                    Math.random() *
                    loadingMessages.length
                )
            ]
        );
        try {

            const response = await askAI(
                uploadId,
                currentQuestion
            );

            // Add AI response
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: response.answer,
                },
            ]);

        } catch (error) {

            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: "Sorry, something went wrong while generating the response.",
                },
            ]);

        } finally {

            setLoading(false);

        }
    }

    return (

        <div className="flex h-full flex-col">

            {/* Chat */}

            <div className="flex-1 overflow-y-auto space-y-5 p-6">

                {messages.map((message, index) => (

                    <ChatBubble
                        key={index}
                        role={message.role}
                        text={message.text}
                    />

                ))}

                {loading && (
                    <ChatBubble role="assistant">
                        <TypingIndicator />
                        <p className="mt-2 text-xs text-muted-foreground">
                            {loadingText}
                        </p>
                    </ChatBubble>
                )}
                {/* Auto-scroll target */}
                <div ref={bottomRef} />

            </div>

            {/* Suggestions */}

            <div className="border-t px-5 py-4">

                <div className="flex flex-wrap gap-2">

                    {suggestions.map((suggestion) => (

                        <button
                            key={suggestion}
                            onClick={() =>
                                setQuestion(suggestion)
                            }
                            className="
                                rounded-full
                                border
                                px-3
                                py-1.5
                                text-sm
                                hover:bg-muted
                                transition
                            "
                        >
                            {suggestion}
                        </button>

                    ))}

                </div>

            </div>

            {/* Input */}

            <div className="border-t p-4 flex gap-3">

                <input
                    value={question}
                    onChange={(e) =>
                        setQuestion(e.target.value)
                    }
                    onKeyDown={(e) => {

                        if (
                            e.key === "Enter" &&
                            !e.shiftKey
                        ) {
                            e.preventDefault();
                            handleAsk();
                        }

                    }}
                    placeholder="Ask MoneyLens AI..."
                    className="
                        flex-1
                        rounded-xl
                        border
                        px-4
                        py-3
                        outline-none
                        focus:ring-2
                        focus:ring-primary
                    "
                />

                <Button
                    onClick={handleAsk}
                    disabled={loading || !question.trim()}
                    className="px-6 mt-1.5"
                >
                    {loading ? "..." : "➜"}
                </Button>

            </div>

        </div>

    );

}