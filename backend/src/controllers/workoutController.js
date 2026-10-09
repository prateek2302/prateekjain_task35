import mongoose from "mongoose";
import Workout from "../models/Workout.js";

const validateWorkoutInput = (body = {}) => {
  const errors = {};
  const input = body && typeof body === "object" && !Array.isArray(body) ? body : {};
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const loadInput = typeof input.load === "string" ? input.load.trim() : input.load;
  const repsInput = typeof input.reps === "string" ? input.reps.trim() : input.reps;
  const load = loadInput === "" || loadInput === null || loadInput === undefined ? NaN : Number(loadInput);
  const reps = repsInput === "" || repsInput === null || repsInput === undefined ? NaN : Number(repsInput);

  if (!title) errors.title = "Workout title is required.";
  else if (title.length > 80) errors.title = "Workout title must be 80 characters or fewer.";
  if (!Number.isFinite(load) || load < 0) errors.load = "Load must be a number greater than or equal to 0.";
  if (!Number.isInteger(reps) || reps < 1) errors.reps = "Reps must be a whole number greater than 0.";

  return { errors, values: { title, load, reps } };
};

export const getWorkouts = async (_req, res, next) => {
  try {
    const workouts = await Workout.find().sort({ createdAt: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    next(error);
  }
};

export const createWorkout = async (req, res, next) => {
  const { errors, values } = validateWorkoutInput(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: "Please correct the highlighted fields.", errors });
  }

  try {
    const workout = await Workout.create(values);
    return res.status(201).json(workout);
  } catch (error) {
    return next(error);
  }
};

export const updateWorkout = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid workout ID." });
  }

  const { errors, values } = validateWorkoutInput(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: "Please correct the highlighted fields.", errors });
  }

  try {
    const workout = await Workout.findByIdAndUpdate(req.params.id, values, {
      new: true,
      runValidators: true
    });
    if (!workout) return res.status(404).json({ message: "Workout not found." });
    return res.status(200).json(workout);
  } catch (error) {
    return next(error);
  }
};

export const deleteWorkout = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid workout ID." });
  }

  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) return res.status(404).json({ message: "Workout not found." });
    return res.status(200).json(workout);
  } catch (error) {
    return next(error);
  }
};
