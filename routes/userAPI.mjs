import express from "express";
import { createNewUser, removeUser, getAllUsers } from "../controllers/userController.mjs";

const userRouter = express.Router();


userRouter.post("/", async (req, res) => {
    const { email } = req.body;
    const password = req.token; 

    if (!email || !password) {
        return res.status(400).json({ error: "Mangler epost eller passord" });
    }

    try {
        const newUser = await createNewUser(email, password);
        res.status(201).json({ 
            message: "Bruker opprettet", 
            user: { id: newUser.id, email: newUser.email } 
        });
    } catch (err) {
        res.status(500).json({ error: "Kunne ikke opprette bruker i databasen" });
    }
});


userRouter.delete("/", async (req, res) => {
    const { id } = req.body;
    
    try {
        const wasDeleted = await removeUser(id);
        if (wasDeleted) {
            res.status(200).json({ message: "Bruker slettet" });
        } else {
            res.status(404).json({ error: "Bruker ikke funnet i databasen" });
        }
    } catch (err) {
        res.status(500).json({ error: "Kunne ikke slette bruker" });
    }
});

userRouter.get("/all", async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Kunne ikke hente brukere" });
    }
});

export default userRouter;