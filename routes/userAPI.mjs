import express from "express"
import user from "../do/user.mjs";
import { generateID } from "../do/user.mjs";

const userRouter = express.Router();
const temporaryUserStore = [];

userRouter.use(express.json());

userRouter.post("/", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Mangler epost eller passord" });
    }

    let newUser = user();
    newUser.id = generateID();
    newUser.email = email;
    newUser.token = req.token;

    temporaryUserStore.push(newUser);

    res.status(201).json({ 
        message: "Bruker opprettet", 
        user: { id: newUser.id, email: newUser.email } 
    });
});

userRouter.delete("/", (req, res) => {
    const { id } = req.body;
    
    const index = temporaryUserStore.findIndex(u => u.id === id);

    if (index !== -1) {
        temporaryUserStore.splice(index, 1);
        res.status(200).json({ message: "Bruker slettet" });
    } else {
        res.status(404).json({ error: "Bruker ikke funnet" });
    }
});

export default userRouter;