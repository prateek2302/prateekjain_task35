import { Router } from "express";
import {
  createWorkout,
  deleteWorkout,
  getWorkouts,
  updateWorkout
} from "../controllers/workoutController.js";

const router = Router();

router.get("/", getWorkouts);
router.post("/", createWorkout);
router.patch("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;
