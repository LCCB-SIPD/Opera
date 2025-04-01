import jwt from "jsonwebtoken";
import dbConfig from "../dbConnect";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { username, password } = await req.json();

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            "SELECT id, username, passwd FROM user_tbl WHERE username = ? LIMIT 1",
            [username]
        );

        if (rows.length === 0) {
            return new NextResponse("User Not Found", { status: 404 });
        }

        const isValid = await bcrypt.compare(password, rows[0].passwd);
        if (isValid) {
            const token = jwt.sign(
                { id: rows[0].id, username: rows[0].username },
                process.env.REACT_APP_JWT_SECRET_KEY,
                { expiresIn: "1h" }
            );

            // Create response object
            const response = new NextResponse("Log In Successfully", { status: 200 });

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
            return new NextResponse("Invalid Password", { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return new NextResponse("Error with database connection", { status: 500 });
    }
}
