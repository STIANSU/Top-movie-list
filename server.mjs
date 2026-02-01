import express from "express";
import movieRoutes from "./routes/movieRoutes.mjs";
import contentRouter from "./routes/contentAPI.mjs";
import userRouter from "./routes/userAPI.mjs";
import securityAudit from "./middleware/security.mjs";

const port = 8080;
const app = express();


app.use(express.json());
app.use(express.static("public"));


app.use("/api/movies", movieRoutes);
app.use("/user", securityAudit, userRouter);
app.use("/content", contentRouter);

app.listen(port, "127.0.0.1", () => {
  console.log(`Server is listening on port:${port}`);
});
