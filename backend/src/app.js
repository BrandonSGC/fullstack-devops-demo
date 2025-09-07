import express from "express";
import userRoutes from "./routes/user.routes.js";
import cors from "cors";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.use("/api/users", userRoutes);

export default app;
