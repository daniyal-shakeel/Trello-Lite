import { Board, BoardCollaborator } from "../models/board.js";
import { User } from "../models/user.js";
import mongoose from "mongoose";
import { isValidEmail } from "../utils/email/helper.js";
import fs from "fs";
import path from "path";
import { sendMail } from "../utils/email/send.js";
import { collaboratorInviteTemplate } from "../utils/email/templates/collaboratorInvite.js";

const createBoard = async (req, res) => {
  const { name } = req.body;
  const payload = req.payload;
  if (!name) return res.json({ success: false, message: "Name is required" });
  try {
    const exists = await Board.exists({
      name,
      user: new mongoose.Types.ObjectId(payload._id),
    });
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

const sendCollaboratorEmail = async (email, name, boardName, boardId) => {
  const htmlTemplate = collaboratorInviteTemplate({ name, boardName, boardId });

  return await sendMail(
    email,
    `Invitation to collaborate on the project board: ${boardName}`,
    `Hello ${name}, You have been invited to collaborate on the board: ${boardName}`,
    htmlTemplate
  );
};

const addCollaborators = async (req, res) => {
  const payload = req.payload;
  const { collaborators } = req.body;
  const { boardId } = req.params;

  if (!boardId) {
    return res.json({ success: false, message: "Board ID is required" });
  }
  if (
    !collaborators ||
    !Array.isArray(collaborators) ||
    collaborators.length === 0
  ) {
    return res.json({
      success: false,
      message: "Collaborators array is required",
    });
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

    const validEmails = collaborators
      .map((email) => email.trim().toLowerCase())
      .filter((email) => isValidEmail(email));

    if (validEmails.length === 0) {
      return res.json({
        success: false,
        message: "No valid emails provided",
      });
    }

    const existingUsers = await User.find({
      email: { $in: validEmails },
    }).select("email name");

    const existingEmails = existingUsers.map((u) => u.email);

    const nonRegisteredEmails = validEmails.filter(
      (email) => !existingEmails.includes(email)
    );

    if (nonRegisteredEmails.length > 0) {
      return res.json({
        success: false,
        message: `Some users are not registered: ${nonRegisteredEmails.join(
          ", "
        )}`,
      });
    }

    let collabDoc = await BoardCollaborator.findOne({ boardId: board._id });

    if (!collabDoc) {
      collabDoc = await BoardCollaborator.create({
        boardId: board._id,
        collaborators: [],
      });
    }

    const existingSet = new Set(collabDoc.collaborators);
    const newEmails = validEmails.filter((email) => !existingSet.has(email));

    if (newEmails.length === 0) {
      return res.json({
        success: false,
        message: "All provided collaborators already exist",
      });
    }

    collabDoc.collaborators.push(...newEmails);
    await collabDoc.save();

    for (const email of newEmails) {
      const user = existingUsers.find((u) => u.email.toString() === email.toString());
      console.log(user)
      if (user) {
        await sendCollaboratorEmail(email, user.name, board.name, board._id);
      }
    }

    return res.json({
      success: true,
      message: "Collaborators added successfully",
      collaborators: collabDoc.collaborators,
    });
  } catch (error) {
    console.error("Error in addCollaborators function: ", error.message);
    return res.json({
      success: false,
      message: "Error adding collaborators",
    });
  }
};

const getBoard = async (req, res) => {
  const payload = req.payload;
  const { boardId: id } = req.params;

  if (!id) {
    return res.json({ success: false, message: "Board ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ success: false, message: "Invalid Board ID format" });
  }

  try {
    const board = await Board.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user: new mongoose.Types.ObjectId(payload._id),
    });

    if (!board) {
      return res.json({
        success: false,
        message: "Board not found or you are not authorized",
      });
    }

    const collaboratorsDoc = await BoardCollaborator.findOne({
      boardId: board._id,
    });

    let collaborators = [];
    if (collaboratorsDoc && collaboratorsDoc.collaborators.length > 0) {
      const users = await User.find({
        email: { $in: collaboratorsDoc.collaborators },
      }).select("_id name email");

      collaborators = users.map((u) => ({
        userId: u._id,
        name: u.name,
        email: u.email,
      }));
    }

    return res.json({
      success: true,
      message: "Board fetched successfully",
      board,
      collaborators,
    });
  } catch (error) {
    console.error("Error in getBoard function:", error.message);
    return res.json({
      success: false,
      message: "Error in fetching board",
    });
  }
};

export {
  createBoard,
  getAllBoards,
  deleteBoard,
  changeStatus,
  addCollaborators,
  getBoard,
};
