import express from "express";
import {
  createBoard,
  getAllBoards,
  deleteBoard,
  changeStatus,
} from "../controllers/board.js";
import { userAuth } from "../middlewares/userAuth.js";

const boardRouter = express.Router();

boardRouter.post("/create-board", userAuth, createBoard);
boardRouter.get("/get-all-boards", userAuth, getAllBoards);
boardRouter.delete("/delete-board/:id", userAuth, deleteBoard);
boardRouter.post("/change-status/:status", userAuth, changeStatus);

export { boardRouter };
