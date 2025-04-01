import mysql from "mysql2/promise";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {

        const { prd_name, prd_price, username, quantity, categories } = await req.json()

        const cleanPrd_name = prd_name.trim().replace(/\b\w/g, (char) => char.toUpperCase());
        const cleanPrd_price = prd_price.trim().toLowerCase()
        const cleanCategories = categories.trim().toLowerCase()
        const cleanQuantity = quantity.trim().toLowerCase()

        const connection = await mysql.createConnection(dbConfig)

        const [rows] = await connection.execute(
            "INSERT INTO product_tbl (name, price, user_owner, qty, categories) VALUES (?, ?, ?, ?, ?)",
            [cleanPrd_name, cleanPrd_price, username, cleanQuantity, cleanCategories]
        )

        await connection.end()

        return NextResponse.json(
            { message: 'Successfully Sell', data: rows[0] },
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

