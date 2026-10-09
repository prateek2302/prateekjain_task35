import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Workout title is required."],
      trim: true,
      maxlength: [80, "Workout title must be 80 characters or fewer."]
    },
    load: {
      type: Number,
      required: [true, "Load is required."],
      min: [0, "Load cannot be negative."],
      validate: {
        validator: Number.isFinite,
        message: "Load must be a valid number."
      }
    },
    reps: {
      type: Number,
      required: [true, "Reps are required."],
      min: [1, "Reps must be at least 1."],
      validate: {
        validator: Number.isInteger,
        message: "Reps must be a whole number."
      }
    }
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
