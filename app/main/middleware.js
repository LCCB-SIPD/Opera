import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("token")?.value; // Get token value properly

    if (!token) {
        return NextResponse.redirect(new URL("/", req.url)); // Redirect to login page
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Attach user info to request headers
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("X-User-Id", user.id);
        requestHeaders.set("X-Username", user.username);

        return NextResponse.next({ headers: requestHeaders }); // Allow request to continue
    } catch (error) {
        return NextResponse.redirect(new URL("/", req.url)); // Redirect if token is invalid
    }
}

// Define protected routes (where middleware runs)
export const config = {
    matcher: ["/main/Welcome", "/main/Profile"],
};
