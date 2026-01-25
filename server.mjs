import express from "express";
import movieRoutes from "./routes/movieRoutes.mjs";

const port = 8080;
const app = express();


app.use(express.json());
app.use(express.static("public"));


app.use("/api/movies", movieRoutes);

app.listen(port, () => {
  console.log(`Film app listening on port ${port}`);
});