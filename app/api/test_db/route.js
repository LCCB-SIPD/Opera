
import mysql from "mysql2/promise";

import dbConfig from "../dbConnect";

export async function GET() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.ping(); // ✅ Check if database is connected

        return Response.json({ message: "✅ Database connected successfully!" });

    } catch (error) {
        console.error("❌ Database Error:", error.message);
        return Response.json({ error: "Database connection failed." }, { status: 500 });

    } finally {
        if (connection) {
            await connection.end(); // Close connection
        }
    }
}
