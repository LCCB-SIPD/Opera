import dbConfig from "../dbConnect";
import mysql from "mysql2/promise"
import bcrypt from "bcryptjs"

export async function POST(req) {
    
    const { username, password } = await req.json()

    try {

        const connection = await mysql.createConnection(dbConfig)
        const [rows] = await connection.execute(
            "SELECT * FROM user_tbl WHERE username = ?",
            [username]
        )

        if (rows.length === 0) {
            return new Response("User Not Found", { status: 404 })
        }

        const isValid = await bcrypt.compare(password, rows[0].passwd)
        if (isValid) {
            return new Response("Log In Successfully", { status: 200 })
        } else {
            return new Response("Invalid Password", { status: 400 })
        }

    } catch (error) {
        console.error(error);
        return new Response("Error with database connection", { status: 500 });
    }


}