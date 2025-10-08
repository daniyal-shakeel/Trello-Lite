import express from "express";
import {
  createComment,
  getCommentsByTask,
  updateComment,
  deleteComment,
} from "../controllers/comment.js";

const commentRouter = express.Router();

commentRouter.post("/create", createComment);
commentRouter.get("/task/:taskId", getCommentsByTask);
commentRouter.put("/update/:commentId", updateComment);
commentRouter.delete("/delete/:commentId", deleteComment);

export { commentRouter };
