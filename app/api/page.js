
import mysql from "mysql2/promise"

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'one_for_all'
}

export default async function handler(req, res) {
    try {

        const connection = await mysql.createConnection(dbConfig)

        const [rows] = await connection.execute('SELECT * FROM user_tbl')

        await connection.end()

        res.status(200).json(rows)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}