import mongoose from "mongoose";
import { User } from "./user.js";
import { board } from "../utils/default-values/board.js";

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
    },
    isDefault: { type: Boolean, default: board.default },
    status:{type:String, enum:board.statuses, default:board.defaultStatus}
  },
  { timestamps: true }
);

const Board = mongoose.models.Board || mongoose.model("Board", boardSchema);

export { Board };
