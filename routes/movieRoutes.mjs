import express from "express";
import { validateMovie } from "../middleware/validate.mjs";
const router = express.Router();


router.get("/", (req, res) => {
  res.json({ message: "Henter filmer" });
});


router.post("/", validateMovie, (req, res) => {
  res.json({ message: "Legger til filmer" });
});


router.delete("/:id", (req, res) => {
  res.json({ message: `Sletter film med id ${req.params.id}` });
});

export default router;