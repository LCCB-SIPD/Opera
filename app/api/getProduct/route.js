import dbConfig from "../dbConnect";
import mysql from "mysql2/promise"
import { NextResponse } from "next/server";


export async function GET(req) {

    try {

        const connection = await mysql.createConnection(dbConfig)

        const [rows] = await connection.execute(
            "SELECT * FROM product_tbl LIMIT 100"
        )

        return NextResponse.json(
            { message: 'Fecth all Successfully', data: rows },
            { status: 200 }
         )

    } catch (error) {

        console.error(error);
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        );

    }

}