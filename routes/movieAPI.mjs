import express from "express";
import { addMovie, getMoviesByUser } from "../controllers/movieController.mjs";

const movieRouter = express.Router();


movieRouter.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const movies = await getMoviesByUser(userId);
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: "Kunne ikke hente filmer" });
    }
});


movieRouter.post("/", async (req, res) => {
    const { userId, title, rating, comment } = req.body;

    if (!userId || !title || !rating) {
        return res.status(400).json({ error: "Mangler info (bruker, tittel eller terningkast)" });
    }

    try {
        const newMovie = await addMovie(userId, title, rating, comment);
        res.status(201).json({ message: "Film lagt til!", movie: newMovie });
    } catch (error) {
        res.status(500).json({ error: "Kunne ikke lagre filmen" });
    }
});

export default movieRouter;