import mysql from "mysql2/promise";
import { NextResponse } from "next/server";


export async function GET() {
	try {

        const connections = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        })

        if (connections) {
            return NextResponse.json({ status: 200 });
        }

    } catch (err) {
        if (err) {
            return NextResponse.json({ status: 500 });
        }
    }
}


