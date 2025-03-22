
import mysql from "mysql2/promise";

const dbConfig = {
    host: 'metro.proxy.rlwy.net',
    user: 'root',  
    password: 'JHoLNUUONqCLPdIipwcqKaYAXogjRGGu', 
    database: 'railway', 
    port: 39376 
};

// ✅ Correct Next.js 13+ App Router API format
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
