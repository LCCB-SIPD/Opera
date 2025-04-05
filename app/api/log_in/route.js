import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {

    const { username, password } = await req.json();

        const phpUrl = `${process.env.REACT_APP_PHP_FILE_LOG_IN_USER}`

        const data = await fetch(phpUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                passwd: password
            }),
        }) 

        const result = await data.json()
        
        if (result.success) {

            const token = jwt.sign(
                { id: result.dataId, username: result.dataUsername, email: result.dataEmail },
                process.env.REACT_APP_JWT_SECRET_KEY,
                { expiresIn: "1h" }
            );

            // Create response object
            const response = NextResponse.json( { message: result.message }, { status: 200 } )

            // Set cookie properly
            response.cookies.set({
                name: "token",
                value: token,
                path: "/",
                httpOnly: true,  // Protect from JavaScript access
                maxAge: 3600,    // 1 hour expiration
                secure: process.env.NODE_ENV === "production", // Secure in production
                sameSite: "Strict",
            });

            return response;

        } else {

            return NextResponse.json( { error: result.message }, { status: 404 } );

        }

}
