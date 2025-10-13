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
      required: true,
    },
    isDefault: { type: Boolean, default: board.isDefault },
    status: {
      type: String,
      enum: board.statuses,
      default: board.status,
    },
  },
  { timestamps: true }
);

const Board = mongoose.models.Board || mongoose.model("Board", boardSchema);
const collaboratorSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Board.modelName,
      required: true,
    },
    collaborator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
    },
  },
  { timestamps: true }
);

const BoardCollaborator =
  mongoose.models.BoardCollaborator ||
  mongoose.model("Board Collaborator", collaboratorSchema);

export { Board, BoardCollaborator };
