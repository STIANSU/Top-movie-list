import express from "express";
import { createNewUser, removeUser, getAllUsers, loginUser } from "../controllers/userController.mjs";

const userRouter = express.Router();


const dict = {
    no: {
        missing_fields: "Mangler e-post eller passord",
        user_created: "Bruker opprettet",
        create_error: "Kunne ikke opprette bruker i databasen",
        user_deleted: "Bruker slettet",
        not_found: "Bruker ikke funnet i databasen",
        delete_error: "Kunne ikke slette bruker",
        fetch_error: "Kunne ikke hente brukere",
        login_ok: "Innlogging vellykket",
        login_fail: "Feil e-post eller passord",
        server_error: "Serverfeil ved innlogging"
    },
    en: {
        missing_fields: "Missing email or password",
        user_created: "User created successfully",
        create_error: "Could not create user in the database",
        user_deleted: "User deleted successfully",
        not_found: "User not found in the database",
        delete_error: "Could not delete user",
        fetch_error: "Could not fetch users",
        login_ok: "Login successful",
        login_fail: "Invalid email or password",
        server_error: "Server error during login"
    }
};


userRouter.use((req, res, next) => {
    let lang = 'no';
    if (req.headers['accept-language']) {
        const browserLang = req.headers['accept-language'].split(',')[0].slice(0, 2).toLowerCase();
        if (dict[browserLang]) {
            lang = browserLang;
        }
    }
    
    req.lang = lang;
    next();
});

userRouter.post("/", async (req, res) => {
    const { email, password } = req.body; 

    if (!email || !password) {
        return res.status(400).json({ error: dict[req.lang].missing_fields });
    }
    try {
        const newUser = await createNewUser(email, password);
        res.status(201).json({ 
            message: dict[req.lang].user_created, 
            user: { id: newUser.id, email: newUser.email } 
        });
    } catch (err) {
        res.status(500).json({ error: dict[req.lang].create_error });
    }
});

userRouter.delete("/", async (req, res) => {
    const { id } = req.body;
    
    try {
        const wasDeleted = await removeUser(id);
        if (wasDeleted) {
            res.status(200).json({ message: dict[req.lang].user_deleted });
        } else {
            res.status(404).json({ error: dict[req.lang].not_found });
        }
    } catch (err) {
        res.status(500).json({ error: dict[req.lang].delete_error });
    }
});

userRouter.get("/all", async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: dict[req.lang].fetch_error });
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser(email, password);

        if (user) {
            res.status(200).json({ message: dict[req.lang].login_ok, user: user });
        } else {
            res.status(401).json({ error: dict[req.lang].login_fail });
        }
    } catch (err) {
        res.status(500).json({ error: dict[req.lang].server_error });
    }
});

export default userRouter;