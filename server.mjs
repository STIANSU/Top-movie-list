import express from "express";
import movieRoutes from "./routes/movieRoutes.mjs";
import contentRouter from "./routes/contentAPI.mjs";
import userRouter from "./routes/userAPI.mjs";

const PORT = process.env.PORT || 8080;
const app = express();


app.use(express.json());
app.use(express.static("public"));


app.use("/api/movies", movieRoutes);
app.use("/user", userRouter);
app.use("/content", contentRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port:${PORT}`);
});