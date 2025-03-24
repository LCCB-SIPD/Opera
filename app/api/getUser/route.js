import dbConfig from "../dbConnect";
import mysql from "mysql2/promise"
import { NextResponse } from "next/server";

export async function POST(req) {

    try {

        const body = await req.json();
        const username = body?.username;

        if (!username) {
            return NextResponse.json({ error: "Username Session Not Found!!!" }, { status: 404 });
        }

        const connection = await mysql.createConnection(dbConfig)

        const [rows] = await connection.execute(
            "SELECT * FROM user_tbl WHERE username = ? LIMIT 1",
            [username]
        )
        
        await connection.end()

        if (rows[0].name) {

            return NextResponse.json(
                { message: 'Fetch Data Successfully', data: rows[0] },
                { status: 200 }
            )

        } else {

            return NextResponse.json(
                { error: 'Update User Info'},
                { status: 400 }
            )

        }

        

    } catch(error) {

        console.error("Error during user signup:", error);
        return NextResponse.json({ error: "Database connection failed." }, { status: 500 });
    }

}