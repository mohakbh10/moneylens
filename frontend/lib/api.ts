const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

export async function getUploads() {
    const response =
        await fetch(
            `${API_URL}/uploads`
        );

    return response.json();
}

export async function processStatement(
    uploadId: string
) {

    const response =
        await fetch(
            `${API_URL}/process-statement`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

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
    const response = await fetch(
        `${API_URL}/insights/${uploadId}`
    );

    return await response.json();
}

export async function getTransactions(
    uploadId: string
) {
    const response = await fetch(
        `${API_URL}/transactions/${uploadId}`
    );

    return await response.json();
}

export async function getAISummary(
    uploadId: string
) {
    const response = await fetch(
        `${API_URL}/ai-summary`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                upload_id: uploadId,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch AI summary"
        );
    }

    return response.json();
}

export async function askAI(
    uploadId: string,
    question: string
) {
    const response = await fetch(
        `${API_URL}/ask-ai`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                upload_id: uploadId,
                question,
            }),
        }
    );

    if (!response.ok)
        throw new Error("AI failed");

    return response.json();
}