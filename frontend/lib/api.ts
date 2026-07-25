import { supabase } from "./supabase";
const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

async function getAuthHeaders() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        throw new Error("User not authenticated");
    }

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
    };
}

export async function getUploads() {

    const headers =
        await getAuthHeaders();

    const response = await fetch(
        `${API_URL}/uploads`,
        {
            headers,
        }
    );

    if (!response.ok) {

        const errorText =
            await response.text();

        console.error(
            "Uploads API error:",
            response.status,
            errorText
        );

        throw new Error(
            `Failed to fetch uploads: ${response.status}`
        );
    }

    return response.json();
}

export async function processStatement(
    uploadId: string
) {
    const headers = await getAuthHeaders();
    const response =
        await fetch(
            `${API_URL}/process-statement`,
            {
                method: "POST",
                headers,
                body: JSON.stringify({
                    upload_id: uploadId,
                }),
            }
        );

    if (!response.ok) {
        throw new Error(
            "Failed to process statement"
        );
    }

    return response.json();
}
/* What is happening:
 * This function sends a POST request to the backend API to process a bank statement.
 * It takes an uploadId as a parameter and returns the processed statement data.
 * which api endpoint: /process-statement
 */
export async function getInsights(
    uploadId: string
) {

    const headers =
        await getAuthHeaders();

    const response = await fetch(
        `${API_URL}/insights/${uploadId}`,
        {
            headers,
        }
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch insights: ${response.status}`
        );
    }

    return response.json();
}

export async function getTransactions(
    uploadId: string
) {

    const headers =
        await getAuthHeaders();

    const response = await fetch(
        `${API_URL}/transactions/${uploadId}`,
        {
            headers,
        }
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch transactions: ${response.status}`
        );
    }

    return response.json();
}

export async function getAISummary(
    uploadId: string
) {
    const headers = await getAuthHeaders();

    const response = await fetch(
        `${API_URL}/ai-summary`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                upload_id: uploadId,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            `Failed to generate AI summary: ${response.status}`
        );
    }

    return response.json();
}

export async function askAI(
    uploadId: string,
    question: string
) {
    const headers = await getAuthHeaders();

    const response = await fetch(
        `${API_URL}/ask-ai`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                upload_id: uploadId,
                question: question,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            `Ask AI failed: ${response.status}`
        );
    }

    return response.json();
}

export async function getBudgets(
    month: string
) {
    const headers =
        await getAuthHeaders();
    const response = await fetch(
        `${API_URL}/budgets?month=${encodeURIComponent(month)}`,
        {
            headers,
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch budgets"
        );
    }
    return response.json();
}


export async function saveBudget(
    category: string,
    amount: number,
    month: string
) {

    const headers =
        await getAuthHeaders();

    const response = await fetch(
        `${API_URL}/budgets`,
        {
            method: "POST",

            headers,

            body: JSON.stringify({
                category,
                amount,
                month,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to save budget"
        );
    }

    return response.json();
}