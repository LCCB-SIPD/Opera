import { NextResponse } from "next/server";
import nodemailer from 'nodemailer'

export async function POST(req) {

    const { email, username } = await req.json()

    const phpUrl = `${process.env.CHECKCONNECTION_DATABASE}`

    const response = await fetch(phpUrl)

    const result = await response.json()

    if (result.success) {

        const cleanEmail = email.trim().toLowerCase();
        const cleanUsername = username.trim().toLowerCase();

        const generateCode = () => {
            return Math.floor(1000 + Math.random() * 9000).toString()
        }
        const confirmationCode = generateCode();
    
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

        try {
    
            await transporter.sendMail(mailOption)
    
            return NextResponse.json( { message: confirmationCode }, { status: 200 } )
    
        } catch (error) {
    
            return NextResponse.json( { error: "API Connection Failed" }, { status: 404 } )
    
        }

    } else {

        return NextResponse.json( { error: "Database is offline" }, { status: 500 } )

    }

    

    

}
