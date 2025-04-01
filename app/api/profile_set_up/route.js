
import mysql from "mysql2/promise"
import { NextResponse } from "next/server";

export async function POST(req) {
    
    try {

        const { username, name, date } = await req.json()

        const cleanNAme = name.trim()
        const cleanDate = date.trim()

        const connection = await mysql.createConnection(dbConfig)

        const [update] = await connection.execute(
            "UPDATE user_tbl SET name = ?, birth = ? WHERE username = ?",
            [cleanNAme, cleanDate, username]
        )

        await connection.end();

        return NextResponse.json(
            { message: 'User Updated Successfully', data: update},
            { status: 200 }
        )

    } catch (error) {
        console.error("Error during user signup:", error);
        return NextResponse.json({ error: "Database connection failed." }, { status: 500 });
    }

}