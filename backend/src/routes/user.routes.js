import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserByEmail,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:email", getUserByEmail);

export default router;
