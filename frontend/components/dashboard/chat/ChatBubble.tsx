"use client";

import { Bot, User } from "lucide-react";
import { ReactNode } from "react";

type Props = {
    role: "user" | "assistant";
    text?: string;
    children?: ReactNode;
};

export default function ChatBubble({
    role,
    text,
    children,
}: Props) {

    const isUser = role === "user";

    return (

        <div
            className={`flex ${
                isUser
                    ? "justify-end"
                    : "justify-start"
            }`}
        >

            <div
                className={`
                    flex
                    gap-3
                    max-w-[85%]
                    ${isUser && "flex-row-reverse"}
                `}
            >

                <div
                    className="
                        w-10
                        h-10
                        rounded-full
                        bg-muted
                        flex
                        items-center
                        justify-center
                        shrink-0
                    "
                >

                    {isUser
                        ? <User size={18} />
                        : <Bot size={18} />}

                </div>

                <div
                    className={`
                        rounded-2xl
                        px-4
                        py-3
                        shadow-sm
                        whitespace-pre-wrap
                        leading-7
                        ${
                            isUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                        }
                    `}
                >

                    {children ?? text}

                </div>

            </div>

        </div>

    );

}