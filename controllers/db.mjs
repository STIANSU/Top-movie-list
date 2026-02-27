import pg from "pg";
import "dotenv/config";


const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

export default pool;