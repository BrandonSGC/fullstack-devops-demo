import express from "express";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.use("/api/users", userRoutes);

export default app;
