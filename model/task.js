import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    due_date: {
      type: Date,
    },
    ip_address: {
      type: String,
    },
    priority: {
      type: String,
      default: "Low",
      enum: {
        values: ["Low", "Medium", "High"],
        message: "{VALUE} is not supported",
      },
    },
    status: {
      type: String,
      default: "pending",
      enum: {
        values: ["pending", "in-progress", "done"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);

export const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
