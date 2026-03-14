import express from "express";
import { addMovie, getMoviesByUser, markAsWatched, deleteMovie } from "../controllers/movieController.mjs";

const movieRouter = express.Router();

movieRouter.get("/:userId", async (req, res) => {
    try {
        const movies = await getMoviesByUser(req.params.userId);
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: "Kunne ikke hente filmer" });
    }
});

movieRouter.post("/", async (req, res) => {
    const { userId, title, rating, comment, status } = req.body;
    if (!userId || !title) return res.status(400).json({ error: "Mangler info" });

    try {
        const newMovie = await addMovie(userId, title, rating, comment, status);
        res.status(201).json({ message: "Film lagt til!", movie: newMovie });
    } catch (error) {
        res.status(500).json({ error: "Kunne ikke lagre filmen" });
    }
});

movieRouter.patch("/:movieId/watched", async (req, res) => {
    const { movieId } = req.params;
    const { rating, comment } = req.body; 

    try {
        const updatedMovie = await markAsWatched(movieId, rating, comment);
        res.status(200).json(updatedMovie);
    } catch (error) {
        res.status(500).json({ error: "Kunne ikke oppdatere filmen" });
    }
});

movieRouter.delete("/:movieId", async (req, res) => {
    const { movieId } = req.params;
    try {
        await deleteMovie(movieId);
        res.status(200).json({ message: "Film slettet" });
    } catch (error) {
        res.status(500).json({ error: "Kunne ikke slette filmen" });
    }
});

export default movieRouter;