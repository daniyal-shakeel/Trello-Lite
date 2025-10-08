import mongoose from "mongoose";
import { Board } from "./board.js";
import { User } from "./user.js";
import { task } from "../utils/default-values/task.js";

const taskSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Board.modelName,
      required: task.boardIdRequired,
    },
    title: {
      type: String,
      required: task.titleRequired,
      trim: task.titleTrim,
      minLength: task.minLength,
      maxLength: task.maxLength,
    },
    description: {
      type: String,
      trim: task.descriptionTrim,
    },
    dueDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: task.createdByRequired,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
    },
  },
  { timestamps: task.timeStamps }
);

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export { Task };
