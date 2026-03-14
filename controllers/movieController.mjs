import pool from "./db.mjs";


export async function addMovie(userId, title, rating, comment) {
    const query = `
        INSERT INTO movies (user_id, title, rating, comment) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
    `;
    const values = [userId, title, rating, comment];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Feil ved lagring av film:", error);
        throw error;
    }
}


export async function getMoviesByUser(userId) {
    const query = `SELECT * FROM movies WHERE user_id = $1 ORDER BY created_at DESC;`;
    
    try {
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error("Feil ved henting av filmer:", error);
        throw error;
    }
}