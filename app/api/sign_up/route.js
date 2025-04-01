import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {

    const { email, username, e_passwd, c_passwd } = await req.json();

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();
    const cleanE_passwd = e_passwd.trim().toLowerCase();
    const cleanC_passwd = c_passwd.trim().toLowerCase();

    if (cleanE_passwd !== cleanC_passwd) {
        return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    const hashPassword = await bcrypt.hash(c_passwd, 10);

    const phpUrl = `${process.env.REACT_APP_PHP_FILE_INSERT_USER}`;

    const response = await fetch(phpUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: cleanEmail,
            username: cleanUsername,
            password: hashPassword,
        }),
    });

    const result = await response.json()

    if (result.success) {
        return NextResponse.json({ message: result.message }, { status: 200 })
    } else {
        return NextResponse.json({ error: result.message }, { status: 500 })
    }
        
}