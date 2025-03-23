import { NextResponse } from 'next/server';

export async function GET() {
    const response = NextResponse.json({ message: "Logged out successfully!" });

    // Destroy cookies by setting them to empty & expired
    response.cookies.set('token', '', { expires: new Date(0) });

    return response;
}
