import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer'

export async function POST(req) {

    const { email, username, e_passwd, c_passwd } = await req.json();

    const generateCode = () => {
        return Math.floor(1000 + Math.random() * 9000).toString()
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();
    const cleanE_passwd = e_passwd.trim().toLowerCase();
    const cleanC_passwd = c_passwd.trim().toLowerCase();
    const confirmationCode = generateCode();

    if (!cleanEmail) {
        return NextResponse.json( { error: "Email is Undefined" }, {status: 404} )
    }

    const transporter = nodemailer.createTransport({
        service: process.env.GMAIL_USERNAME,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        }
    })

    const mailOption = {
        from: process.env.GMAIL_USERNAME,
        to: cleanEmail,
        subject: 'Verification Code',
        html:  ` <p> Hellow  ${cleanUsername} </p>` + '<h3> Your Code is </h3>' + 
        `<h1 style="color: #fff; font-weight: bold; background-color: #0d1117; padding: 10px; border-radius: 10px;">${confirmationCode}</h1>`
    }

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
            c_email: confirmationCode
        }),
    });

    const result = await response.json()

    if (result.success) {
        await transporter.sendMail(mailOption)
        console.log(" -- Mail Successfully Submited -- ")
        return NextResponse.json({ message: result.message }, { status: 200 })
    } else {
        return NextResponse.json({ error: result.message }, { status: 404 })
    }
        
}