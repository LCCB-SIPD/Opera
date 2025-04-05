import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer'

export async function POST(req) {

    const { email, username, e_passwd, c_passwd } = await req.json();

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();
    
    if (!cleanEmail) {
        return NextResponse.json( { error: "Email is Undefined" }, {status: 404} )
    }

    if (e_passwd !== c_passwd) {  
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
            password: hashPassword
        }),
    });

    const result = await response.json()

    if (result.success) {

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
                    subject: `Welcome ${cleanUsername}`,
                    html:  `<style>
                        

                        .welcome-message {
                            animation: fadeIn 2s linear infinite;
                        }

                        @keyframes fadeIn {
                            0% { color: #fff; }
                            20% { color: #ff0; }
                            40% { color: #0ff; }
                            60% { color: #f00; }
                            70% { color: #0f0; }
                            100% { color: #00f; }
                        }

                        .header {
                            padding: 20px;
                            background-color: #0d1117;
                            border-radius: 10px;
                            color: #fff;
                            animation: fadeIn 2s ease-in-out;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }

                        .header:hover {
                            background-color: #23272a;
                            transition: background-color 0.3s ease;
                        }
                    </style>
                    
                    <p class="welcome-message"> 🎉😊 Welcome ${cleanUsername} </p>
                    <h1 class="header">
                        Welcome to my Web Application and Thank You for Participating
                    </h1>`
                }

                await transporter.sendMail(mailOption)

        return NextResponse.json({ message: result.message }, { status: 200 })

    } else {
        return NextResponse.json({ error: result.message }, { status: 404 })
    }
        
}