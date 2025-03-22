import mysql from "mysql2/promise"
import bcrypt from "bcrypt"
import  dbConfig  from "../dbConnect.js"

export async function POST(req) {
    try {

        const { email, username, e_passwd, c_passwd } = await req.json()

        const cleanEmail = email.trim().toLowerCase()
        const cleanUsername = username.trim().toLowerCase()
        const cleanE_passwd = e_passwd.trim().toLowerCase()
        const cleanC_passwd = c_passwd.trim().toLowerCase()
        
        if (cleanE_passwd !== cleanC_passwd) {
            return new Response(JSON.stringify({ error: "Password Not Match" }, { status: 400 }))
        }

        const hashPassword = await bcrypt.hash(c_passwd, 10)

        const connection = await mysql.createConnection(dbConfig)

        const [existingUser] = await connection.execute(
            'SELECT * FROM user_tbl WHERE email = ? OR username = ?',
            [cleanEmail, cleanUsername]
        )

        if (existingUser.length > 0) {
            await connection.end()
            return new Response(JSON.stringify({ error: "Email or Username already exist" }))
        }

        const [result] = await connection.execute(
            'INSERT INTO user_tbl (username, passwd, email) VALUES (?, ?, ?)',
            [cleanUsername, hashPassword,cleanEmail]
        )

         return new Response(JSON.stringify({ message: 'User registered successfully!', data: result }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

        if (connection) {
            await connection.end()
        }

    } catch (error) {
        console.error("Error during user signup:", error);
        return new Response(JSON.stringify({ error: "Database connection failed." }), { status: 500 });
    }
    
}