import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

// Keep console.log for debugging if needed, or remove it.
//  console.log(process.env.DB_USER);

const config = {
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD , 
    host: process.env.DB_HOST ,
    port: process.env.DB_PORT ,
    database: process.env.DB_NAME , 
    
    
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_CA 
    },
};

export async function queryDatabase(sql) {
    const client = new pg.Client(config);
    try {
        await client.connect();
        console.log('Connected to database.');
        const result = await client.query(sql);
        await client.end();
        console.log('Disconnected from database.');
        return result.rows;

    } catch (err) {
        console.error("Error executing SQL query:", err);
        return []; // Or throw the error
    }
}

// module.exports = { queryDatabase }; // Removed CommonJS export