import mongoose from "mongoose";
import { Task } from "./task.js";
import { User } from "./user.js";
import { Board } from "./board.js";
import { activity } from "../utils/default-values/activity.js";

const activitySchema = new mongoose.Schema(
  {
    user: {
      // who takes an action
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
    },
    action: {
      //action itself
      type: String,
      enum: activity.action,
      required: true,
    },
    when: {
      type: Date,
      default: Date.now,
    },
    task: {
      // on which task the action taken
      type: mongoose.Schema.Types.ObjectId,
      ref: Task.modelName,
    },
    board: {
      // on which board the actioned task exists
      type: mongoose.Schema.Types.ObjectId,
      ref: Board.modelName,
    },
    message: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

const Activity =
  mongoose.models.Activity || mongoose.model("Activity", activitySchema);

export { Activity };
