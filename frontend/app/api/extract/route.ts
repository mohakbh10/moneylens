import { NextRequest , NextResponse} from "next/server";
import pdf from "pdf-parse";

export async function POST (req: NextRequest) {
    try{
        const {fileUrl} = await req.json();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/private/bank-statements/${fileUrl}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                },
            }
        );
        const array
    }catch (error) {

    }
}