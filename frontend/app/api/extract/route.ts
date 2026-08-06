import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { fileUrl } = await req.json();
        
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/private/bank-statements/${fileUrl}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Supabase fetch failed with status: ${response.status}`);
        }

        // Return a success response along with whatever data you need (e.g., text or a blob)
        return NextResponse.json({ success: true, message: "File fetched successfully" });

    } catch (error) {
        // Log the error securely on your server console
        console.error("Extraction error:", error);

        // Return an error response to the frontend client
        return NextResponse.json(
            { error: "Error extracting text from PDF." },
            { status: 500 }
        );
    }
}
