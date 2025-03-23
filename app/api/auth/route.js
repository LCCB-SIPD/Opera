import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return new NextResponse(JSON.stringify(user), { status: 200 });
    } catch (error) {
        return new NextResponse("Invalid Token", { status: 401 });
    }
}
