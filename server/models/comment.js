import mongoose from "mongoose";
import { Task } from "./task.js";
import { User } from "./user.js";
import { comment } from "../utils/default-values/comment.js";

const commentSchema = new mongoose.Schema(
  {
    taskId: {
      // which task
      type: mongoose.Schema.Types.ObjectId,
      ref: Task.modelName,
      required: comment.taskIdRequired,
    },
    authorId: {
      // who comments
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: comment.authorIdRequired,
    },
    content: {
      type: String,
      required: comment.contentRequired,
      trim: comment.contentTrim,
      minlength: comment.minLength,
      maxlength: comment.maxLength,
    },
    isEdited: {
      type: Boolean,
      default: comment.isEdited,
    },
    editedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: comment.isDeleted,
    },
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export { Comment };
