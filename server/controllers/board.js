import { Board } from "../models/board.js";
import { BoardCollaborator } from "../models/BoardCollaborator.js";
import { User } from "../models/user.js";
import mongoose from "mongoose";
import { isValidEmail } from "../utils/email/helper.js";
import { sendMail } from "../utils/email/send.js";
import { collaboratorInviteTemplate } from "../utils/email/templates/collaboratorInvite.js";
import { sanitizeObjectId } from "../utils/sanitizeObjectId.js";
import { logActivity } from "../utils/logActivity.js";

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

    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(payload._id) }).select("name")
    logActivity({
      user: payload._id,
      action: "created_board",
      board: board._id,
      message: `${user.name} created a board *${board.name}*`
    });

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
    const ownedBoards = await Board.find({
      user: new mongoose.Types.ObjectId(payload._id),
    }).lean();

    const collabEntries = await BoardCollaborator.find({
      collaborator: new mongoose.Types.ObjectId(payload._id),
    }).select("boardId");

    const sharedBoardIds = collabEntries.map((c) => c.boardId);

    const sharedBoards = await Board.find({
      _id: { $in: sharedBoardIds },
      user: { $ne: payload._id },
    })
      .lean()
      .then((boards) =>
        boards.map((b) => ({
          ...b,
          isShared: true,
        }))
      );

    const boards = [
      ...ownedBoards.map((b) => ({ ...b, isShared: false })),
      ...sharedBoards,
    ];

    if (boards.length === 0) {
      return res.json({ success: false, message: "No boards found" });
    }

    return res.json({ success: true, boards });
  } catch (error) {
    console.error("An error occurred in getAllBoards:", error.message);
    return res.json({
      success: false,
      message: "Error fetching boards",
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


    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(payload._id) });
    logActivity({
      user: payload._id,
      action: "deleted_board",
      board: board._id,
      message: `${user.name} deleted a board *${board.name}*`
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

    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(payload._id) }).select("name");
    logActivity({
      user: payload._id,
      action: "change_board_status",
      when: new Date(),
      board: board._id,
      message: `${user.name} changed ${board.name} board status to ${board.status}`
    });

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
    }).select("email name _id");
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

    const collaboratorIds = existingUsers.map((u) => u._id);

    const existingCollabs = await BoardCollaborator.find({
      boardId: board._id,
      collaborator: { $in: collaboratorIds },
    }).select("collaborator");

    const existingIds = new Set(
      existingCollabs.map((c) => c.collaborator.toString())
    );

    const newCollaborators = collaboratorIds.filter(
      (id) => !existingIds.has(id.toString())
    );

    if (newCollaborators.length === 0) {
      return res.json({
        success: false,
        message: "All provided collaborators already exist",
      });
    }

    const newCollabDocs = [];
    for (const collabId of newCollaborators) {
      const doc = await BoardCollaborator.create({
        boardId: board._id,
        collaborator: collabId,
      });
      newCollabDocs.push(doc);
    }

    const actor = await User.findOne({ _id: new mongoose.Types.ObjectId(payload._id) }).select("name");

    for (const user of existingUsers) {
      if (
        newCollaborators.some((id) => id.toString() === user._id.toString())
      ) {
        logActivity(
          {
            user: payload._id,
            action: "added_collaborator",
            when: new Date(),
            board: board._id,
            message: `${actor.name} added collaborator\n${user.email}`
          }
        );
        sendCollaboratorEmail(
          user.email,
          user.name,
          board.name,
          board._id
        );
      }
    }

    return res.json({
      success: true,
      message: "Collaborators added successfully",
      collaborators: newCollabDocs,
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
  const payload = req.payload || {};
  const { boardId: id } = req.params || {};

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

    const collaboratorsDocs = await BoardCollaborator.find({
      boardId: board._id,
    }).populate("collaborator", "_id name email");

    const collaborators = collaboratorsDocs.map((doc) => ({
      userId: doc.collaborator._id,
      name: doc.collaborator.name,
      email: doc.collaborator.email,
    }));

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

const getAllCollaborators = async (req, res) => {
  try {
    let { boardId } = req.params || {};

    if (!boardId)
      return res.json({ success: false, message: "Board Id required" });

    let boardCheck = sanitizeObjectId(boardId);
    if (!boardCheck.success)
      return res.json({
        success: boardCheck.success,
        message: boardCheck.message,
      });
    boardId = boardCheck.validId;

    const collaborators = await BoardCollaborator.find({ boardId }).populate(
      "collaborator",
      "_id name email"
    );
    if (collaborators.length === 0)
      return res.json({ success: false, message: "No collaborators found" });

    return res.json({
      success: true,
      message: "Fetched all collaborators",
      collaborators,
    });
  } catch (error) {
    console.log(
      "An error occured in getAllCollaborators function: ",
      error.message
    );
    return res.json({
      success: false,
      message: "Error in fetching collaborators",
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
  getAllCollaborators,
};
