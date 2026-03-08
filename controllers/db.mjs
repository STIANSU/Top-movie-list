import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Feil ved første tilkobling til DB:', err.stack);
    }
    release();
});

export default pool;