const API_URL =
    "http://127.0.0.1:8000";

export async function getUploads() {
    const response =
        await fetch(
        `${API_URL}/uploads`
        );

    return response.json();
}

export async function getInsights(
    uploadId: string
    ) {
    const response =
        await fetch(
        `${API_URL}/insights/${uploadId}`
        );

    return response.json();
}

export async function getTransactions(
    uploadId: string
    ) {
    const response =
        await fetch(
        `${API_URL}/transactions/${uploadId}`
        );

    return response.json();
}