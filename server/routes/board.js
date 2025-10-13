import express from "express";
import {
  createBoard,
  getAllBoards,
  deleteBoard,
  changeStatus,
  addCollaborators,
  getBoard,
  getAllCollaborators,
} from "../controllers/board.js";

const boardRouter = express.Router();

boardRouter.post("/create-board", createBoard);
boardRouter.get("/get-all-boards", getAllBoards);
boardRouter.get("/get-board/:boardId", getBoard);
boardRouter.delete("/delete-board/:id", deleteBoard);
boardRouter.post("/change-status/:status", changeStatus);
boardRouter.post("/collaborators/add/:boardId", addCollaborators);
boardRouter.get("/collaborators/get-all-collaborators/:boardId", getAllCollaborators);

export { boardRouter };
