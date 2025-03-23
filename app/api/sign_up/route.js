import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import dbConfig from "../dbConnect.js";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { email, username, e_passwd, c_passwd } = await req.json();

        const cleanEmail = email.trim().toLowerCase();
        const cleanUsername = username.trim().toLowerCase();
        const cleanE_passwd = e_passwd.trim().toLowerCase();
        const cleanC_passwd = c_passwd.trim().toLowerCase();

        if (cleanE_passwd !== cleanC_passwd) {
            return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
        }

        const hashPassword = await bcrypt.hash(c_passwd, 10);

        const connection = await mysql.createConnection(dbConfig);

        const [existingUser] = await connection.execute(
            "SELECT * FROM user_tbl WHERE email = ? OR username = ?",
            [cleanEmail, cleanUsername]
        );

        if (existingUser.length > 0) {
            await connection.end();
            return NextResponse.json({ error: "Email or Username already exists" }, { status: 400 });
        }

        const [result] = await connection.execute(
            "INSERT INTO user_tbl (username, passwd, email) VALUES (?, ?, ?)",
            [cleanUsername, hashPassword, cleanEmail]
        );

        await connection.end();

        return NextResponse.json(
            { message: "User registered successfully!", data: result },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error during user signup:", error);
        return NextResponse.json({ error: "Database connection failed." }, { status: 500 });
    }
}
