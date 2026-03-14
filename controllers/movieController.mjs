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

export async function markAsWatched(movieId, rating, newComment) {
    const query = `
        UPDATE movies 
        SET status = 'watched', rating = $1, comment = $2
        WHERE id = $3 
        RETURNING *;
    `;
    try {
        const result = await pool.query(query, [rating, newComment, movieId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export async function deleteMovie(movieId) {
    const query = `DELETE FROM movies WHERE id = $1 RETURNING *;`;
    try {
        const result = await pool.query(query, [movieId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}