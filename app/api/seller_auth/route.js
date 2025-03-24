import mysql from "mysql2/promise";
import dbConfig from "../dbConnect.js";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {

        const { prd_name, prd_price } = await req.json()

        const cleanPrd_name = prd_name.trim().toLowerCase();
        const cleanPrd_price = prd_price.trim().toLowerCase()

        const connection = await mysql.createConnection(dbConfig)

        const [rows] = await connection.execute(
            "INSERT INTO product_tbl (name, price) VALUES (?, ?)",
            [cleanPrd_name, cleanPrd_price]
        )

        await connection.end()

        return NextResponse.json(
            { message: 'Submited Successfully', data: rows[0] },
            { status: 200 }
        )

    } catch(error) {
        console.error(error)
        return NextResponse.json(
            { error:  'Database Error' },
            { status: 500 }
        )

    }
}

