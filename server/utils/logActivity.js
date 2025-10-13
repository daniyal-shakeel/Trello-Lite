import mongoose from "mongoose";
import { emitter } from "../config/emitter.js";

const logActivity = ({ user, action, when = new Date(), task = null, board = null, message = "" }) => {
  emitter.emit("activity", {
    user: new mongoose.Types.ObjectId(user),
    action,
    when,
    task: task ? new mongoose.Types.ObjectId(task) : null,
    board: board ? new mongoose.Types.ObjectId(board) : null,
    message,
  });
};

export { logActivity };
