import pg from 'pg';
import { PG_DB_CONFIG } from './index.js';

const { Client } = pg;

async function dbConn() {
    const client = new Client(PG_DB_CONFIG);
    await client.connect();
    console.log('connected to postgres db');

    await client.query(`
        CREATE TABLE IF NOT EXISTS Users(
            user_id SERIAL PRIMARY KEY,
            name VARCHAR(20),
            email VARCHAR(25) NOT NULL, 
            password TEXT NOT NULL
            )`);

    await client.query(`CREATE TABLE IF NOT EXISTS Tasks(
        task_id SERIAL PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        description TEXT,
        due_date DATE,
        status BOOLEAN,
        user_id INTEGER,
            CONSTRAINT fk_user_id
                FOREIGN KEY(user_id)
                REFERENCES Users(user_id)
    )`);

    return client;
}
const db = await dbConn();

export default db;
