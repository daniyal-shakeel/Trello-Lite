import express from "express";
import {
  create,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.js";

const taskRouter = express.Router();

taskRouter.post("/create", create);
taskRouter.get("/get-all-tasks/:boardId", getAllTasks);
taskRouter.put("/update/:boardId/:taskId", updateTask);
taskRouter.delete("/delete/:boardId/:taskId", deleteTask);

export { taskRouter };
