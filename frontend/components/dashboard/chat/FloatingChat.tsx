"use client";

import { useState } from "react";
import { Bot, X } from "lucide-react";
import { BrainCircuit } from "lucide-react";

import AskAI from "./AskAI";

type Props = {
    uploadId: string;
};

export default function FloatingChat({
    uploadId,
}: Props) {

    const [open, setOpen] =
        useState(false);

    if (!open) {

        return (

            <button
                onClick={() => setOpen(true)}
                className="
                    group
                    fixed
                    bottom-6
                    right-6
                    flex
                    items-center
                    gap-3
                    rounded-full
                    bg-primary
                    text-primary-foreground
                    px-5
                    py-4
                    shadow-xl
                    hover:scale-105
                    transition-all
                    z-50
                "
            >

                <Bot size={22}/>

                <span
                    className="
                        max-w-0
                        overflow-hidden
                        whitespace-nowrap
                        transition-all
                        duration-300
                        group-hover:max-w-20
                    "
                >
                    Ask AI
                </span>

            </button>

        );

    }

    return (

        <div
            className="
                fixed
                bottom-6
                right-6
                w-[420px]
                h-[650px]
                rounded-3xl
                border
                bg-background
                shadow-2xl
                flex
                flex-col
                overflow-hidden
                z-50

                animate-in
                fade-in
                zoom-in-95
                duration-200
            ">

            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-b
                    px-5
                    py-4
                "
            >

                <div>

                    <h2 className="font-bold">

                        🤖 MoneyLens AI

                    </h2>

                    <p className="text-xs text-muted-foreground">

                        Personal Finance Assistant

                    </p>

                </div>

                <button
                    onClick={() => setOpen(false)}
                >

                    <X size={20} />

                </button>

            </div>

            <div className="flex-1 overflow-hidden">

                <AskAI uploadId={uploadId} />

            </div>

        </div>

    );

}