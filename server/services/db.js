import { getCipherInfo } from 'crypto';
import 'dotenv/config';
import mysql from 'mysql2';

async function getConnection() {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    });

    return connection;
}

export default getConnection;