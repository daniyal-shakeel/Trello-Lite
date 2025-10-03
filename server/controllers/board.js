import { Board } from "../models/board.js";
import mongoose from "mongoose";

const createBoard = async (req, res) => {
  const { name } = req.body;
  const payload = req.payload;
  console.log(payload);
  if (!name) return res.json({ success: false, message: "Name is required" });
  try {
    const exists = await Board.exists({
      name,
      user: new mongoose.Types.ObjectId(payload._id),
    });
    console.log(exists);
    if (exists)
      return res.json({ success: false, message: "Board already exists" });
    const board = await Board.create({
      name,
      user: new mongoose.Types.ObjectId(payload._id),
    });
    if (!board)
      return res.json({ success: false, message: "Something went wrong" });

    return res.json({ success: true, message: "Board created", board });
  } catch (error) {
    console.log("An error occured in createBoard function: ", error.message);
    return res.json({
      success: false,
      message: "Error in creating board",
    });
  }
};

const getAllBoards = async (req, res) => {
  const payload = req.payload;

  try {
    const boards = await Board.find({
      user: new mongoose.Types.ObjectId(payload._id),
    });

    if (!boards || boards.length === 0) {
      return res.json({ success: false, message: "No boards found" });
    }

    return res.json({ success: true, boards });
  } catch (error) {
    console.log("An error occured in getAllBoards function: ", error.message);
    return res.json({
      success: false,
      message: "Error in fetching boards",
    });
  }
};

const deleteBoard = async (req, res) => {
  const payload = req.payload;
  const { id } = req.params;

  if (!id) return res.json({ success: false, message: "Board ID is required" });

  try {
    const board = await Board.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user: new mongoose.Types.ObjectId(payload._id),
    });

    if (!board)
      return res.json({
        success: false,
        message: "Board not found or you are not authorized",
      });

    if (board.isDefault)
      return res.json({
        success: false,
        message: "Default board can't be deleted",
      });

    await Board.deleteOne({ _id: board._id });

    return res.json({ success: true, message: "Board deleted" });
  } catch (error) {
    console.log("An error occured in deleteBoard function: ", error.message);
    return res.json({
      success: false,
      message: "Error in deleting board",
    });
  }
};

const changeStatus = async (req, res) => {
  const payload = req.payload;
  const { status } = req.params;
  const { boardId } = req.body;

  if (!status) {
    return res.json({ success: false, message: "Status is required" });
  }

  if (!boardId) {
    return res.json({ success: false, message: "Board ID is required" });
  }

  try {
    const board = await Board.findOne({
      _id: new mongoose.Types.ObjectId(boardId),
      user: new mongoose.Types.ObjectId(payload._id),
    });

    if (!board) {
      return res.json({
        success: false,
        message: "Board not found or you are not authorized",
      });
    }

    board.status = status;
    await board.save();

    return res.json({
      success: true,
      message: `Board status changed to ${status}`,
      board,
    });
  } catch (error) {
    console.error("Error in changeStatus function: ", error.message);
    return res.json({
      success: false,
      message: "Error updating board status",
    });
  }
};

export { createBoard, getAllBoards, deleteBoard, changeStatus };
