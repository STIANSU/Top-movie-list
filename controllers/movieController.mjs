import pool from "./db.mjs"; 

export async function addMovie(userId, title, rating, comment, status) {
    const query = `
        INSERT INTO movies (user_id, title, rating, comment, status) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *;
    `;
    const movieRating = rating ? rating : null; 
    const values = [userId, title, movieRating, comment, status];
    
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
        throw error;
    }
}

// NY FUNKSJON: For å flytte filmen til "Sett" og gi stjerner
export async function markAsWatched(movieId, rating) {
    const query = `
        UPDATE movies 
        SET status = 'watched', rating = $1 
        WHERE id = $2 
        RETURNING *;
    `;
    try {
        const result = await pool.query(query, [rating, movieId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}