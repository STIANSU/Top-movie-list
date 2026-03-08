import pool from "./db.mjs"

export async function createNewUser(email, passwordToken) {
    const id = Math.floor(Math.random() * 1000000); 
    
    const username = email; 
    const password = passwordToken; 

    const sql = "INSERT INTO users (id, username, password, email) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [id, username, password, email];

    try {
        const result = await pool.query(sql, values);
        console.log("Bruker lagret i database!");
        return result.rows[0]; 
    } catch (err) {
        console.error("Feil ved lagring i database:", err);
        throw err;
    }
}

export async function removeUser(id) {
    const sql = "DELETE FROM users WHERE id = $1 RETURNING *";
    try {
        const result = await pool.query(sql, [id]);
        return result.rowCount > 0; 
    } catch (err) {
        console.error("Feil ved sletting i database:", err);
        throw err;
    }
}

export async function getAllUsers() {
    const sql = "SELECT * FROM users";
    try {
        const result = await pool.query(sql);
        return result.rows;
    } catch (err) {
        console.error("Feil ved henting av brukere:", err);
        throw err;
    }
}

export async function loginUser(email, password) {
    const sql = "SELECT id, email FROM users WHERE email = $1 AND password = $2";
    const values = [email, password];

    try {
        const result = await pool.query(sql, values);  
        if (result.rows.length > 0) {
            return result.rows[0]; 
        } else {
            return null; 
        }
    } catch (err) {
        console.error("Feil ved innlogging:", err.message);
        throw err;
    }
}