import express from "express";
import { createNewUser, removeUser } from "../controllers/userController.mjs";

const userRouter = express.Router();

userRouter.post("/", (req, res) => {
    const { email } = req.body;
    const password = req.token; 

    if (!email || !password) {
        return res.status(400).json({ error: "Mangler epost eller passord" });
    }

    
    const newUser = createNewUser(email, password);

    res.status(201).json({ 
        message: "Bruker opprettet", 
        user: { id: newUser.id, email: newUser.email } 
    });
});

userRouter.delete("/", (req, res) => {
    const { id } = req.body;
    
    
    const wasDeleted = removeUser(id);

    if (wasDeleted) {
        res.status(200).json({ message: "Bruker slettet" });
    } else {
        res.status(404).json({ error: "Bruker ikke funnet" });
    }
});

export default userRouter;