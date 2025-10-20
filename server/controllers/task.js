import mongoose from "mongoose";
import { Task } from "../models/task.js";
import { User } from "../models/user.js";
import { Board } from "../models/board.js";
import { BoardCollaborator } from "../models/BoardCollaborator.js";
import { validateString } from "../utils/string.js";
import { sanitizeObjectId } from "../utils/sanitizeObjectId.js";
import { task } from "../utils/default-values/task.js";
import { logActivity } from "../utils/logActivity.js";
import {MESSAGES} from "../constants/messages.js";

const create = async (req, res) => {
  try {
    const { title, description, assignTo, board: boardObj, dueDate } = req.body;
    if (!title || !boardObj?.name || !assignTo || !boardObj?.id || !dueDate) {
      return res.json({
        success: false,
        message: "Missing fields are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(boardObj.id)) {
      return res.json({
        success: false,
        message: "Invalid board ID.",
      });
    }

    const board = await Board.findById(boardObj.id);
    if (!board) {
      return res.json({
        success: false,
        message: "Board not found.",
      });
    }

    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      return res.json({
        success: false,
        message: "Invalid due date format.",
      });
    }

    let assignee = null;
    if (assignTo) {
      if (!mongoose.Types.ObjectId.isValid(assignTo)) {
        return res.json({
          success: false,
          message: "Invalid assignee ID.",
        });
      }

      const user = await User.findById(assignTo);
      if (!user) {
        return res.json({
          success: false,
          message: "Assignee user not found.",
        });
      }

      const isCollaborator = await BoardCollaborator.exists({
        boardId: board._id,
        collaborator: user._id,
      });

      if (!isCollaborator) {
        return res.json({
          success: false,
          message: "User is not a collaborator of this board.",
        });
      }

      assignee = user._id;
    }

    const task = new Task({
      boardId: board._id,
      title: title.trim(),
      description: description?.trim() || "",
      dueDate: parsedDate,
      createdBy: req.payload?._id || null,
      assignee,
    });

    await task.save();

    await task.populate([
      { path: "assignee", select: "name email" },
      { path: "createdBy", select: "name email" },
    ]);

    logActivity({
      user: req.payload?._id,
      action: "created_task",
      board: board._id,
      task: task._id,
      message: `${task.createdBy?.name || "Someone"} created a task *${task.title}* on board *${board.name}*`
    });

    return res.json({
      success: true,
      message: "Task created successfully.",
      task,
    });
  } catch (err) {
    console.error("Task creation error:", err);
    return res.json({
      success: false,
      message: "Internal server error.",
      error: err.message,
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const { boardId } = req.params;

    if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
      return res.json({
        success: false,
        message: "Valid board ID is required.",
      });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.json({
        success: false,
        message: "Board not found.",
      });
    }

    const requesterId = req.payload?._id;
    const isOwner = board.user?.toString() === requesterId;
    const isCollaborator = await BoardCollaborator.exists({
      boardId: board._id,
      collaborator: new mongoose.Types.ObjectId(requesterId),
    });

    if (!isOwner && !isCollaborator) {
      return res.json({
        success: false,
        message: "You are not authorized to view tasks for this board.",
      });
    }

    const tasks = await Task.find({
      boardId: board._id,
      $or: [
        { createdBy: requesterId },
        { assignee: requesterId },
      ],
    })
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .sort({ dueDate: 1, createdAt: -1 });

    return res.json({
      success: true,
      message: tasks.length
        ? "Tasks retrieved successfully."
        : "No tasks found for this board.",
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    console.error("An error occured in getAllTasks function: ", err.message);
    return res.json({
      success: false,
      message: "Internal server error.",
      error: err.message,
    });
  }
};

const updateTask = async (req, res) => {
  let { boardId, taskId } = req.params || {};
  const { updatedTaskTitle } = req.body || {};
  if (!taskId)
    return res.json({ success: false, message: MESSAGES.TASK.VALIDATION.TASK_ID_REQUIRED });
  if (!boardId)
    return res.json({ success: false, message: MESSAGES.TASK.VALIDATION.BOARD_ID_REQUIRED });

  let taskCheck = sanitizeObjectId(taskId);
  if (!taskCheck.success)
    return res.json({
      success: taskCheck.success,
      message: taskCheck.message,
    });
  taskId = taskCheck.validId;

  let boardCheck = sanitizeObjectId(boardId);
  if (!boardCheck.success)
    return res.json({
      success: boardCheck.success,
      message: boardCheck.message,
    });
  boardId = boardCheck.validId;

  if (!updatedTaskTitle)
    return res.json({ success: false, message: MESSAGES.TASK.VALIDATION.TITLE_REQUIRED });

  if (String(updatedTaskTitle).length > task.maxLength) {
    return res.json({
      success: false,
      message: "Title is too long",
    });
  }

  if (String(updatedTaskTitle).length < task.minLength) {
    return res.json({
      success: false,
      message: "Title is too short",
    });
  }

  let stringValidation = validateString(updatedTaskTitle);
  if (!stringValidation.success)
    return res.json({
      success: stringValidation.success,
      message: stringValidation.message,
    });

  if (String(updatedTaskTitle).length === 0) {
    return res.json({
      success: false,
      message: "Title is empty",
    });
  }
  try {
    const board = await Board.findOne({ _id: boardId });
    if (!board)
      return res.json({
        success: false,
        message: "Board not found either moved or deleted",
      });

    const task = await Task.findOne({ _id: taskId, boardId });
    if (!task)
      return res.json({
        success: false,
        message: "Task not found either moved or deleted",
      });

    if (task.title === updatedTaskTitle)
      return res.json({ success: false, message: MESSAGES.TASK.VALIDATION.TITLE_UNCHANGED });

    task.title = updatedTaskTitle;
    await task.save();

    logActivity({
      user: req.payload?._id,
      action: "updated_task",
      task: task._id,
      board: boardId,
      message: `Task title updated to *${updatedTaskTitle}* on board *${board.name}*`
    });

    return res.json({
      success: true,
      message: `Title updated to ${updatedTaskTitle}`,
    });
  } catch (error) {
    console.log(
      "An error occured in updateTask in controllers/task.js: ",
      error.message
    );
    return res.json({
      success: false,
      message: "Something went wrong in updating task title",
    });
  }
};

const deleteTask = async (req, res) => {
  let { boardId, taskId } = req.params || {};
  let { _id: userId } = req.payload || {};

  if (!boardId)
    return res.json({ success: false, message: MESSAGES.TASK.VALIDATION.BOARD_ID_REQUIRED_ALT });
  if (!taskId) return res.json({ success: false, message: MESSAGES.TASK.VALIDATION.TASK_ID_REQUIRED_ALT });
  if (!userId) return res.json({ success: false, message: MESSAGES.TASK.VALIDATION.USER_ID_REQUIRED });

  let boardCheck = sanitizeObjectId(boardId);
  if (!boardCheck.success)
    return res.json({
      success: boardCheck.success,
      message: boardCheck.message,
    });
  boardId = boardCheck.validId;

  let taskCheck = sanitizeObjectId(taskId);
  if (!taskCheck.success)
    return res.json({
      success: taskCheck.success,
      message: taskCheck.message,
    });
  taskId = taskCheck.validId;

  let userCheck = sanitizeObjectId(userId);
  if (!userCheck.success)
    return res.json({
      success: userCheck.success,
      message: userCheck.message,
    });
  userId = userCheck.validId;

  try {
    const user = await User.exists({ _id: userId });
    if (!user) return res.json({ success: false, message: MESSAGES.USER.ERROR.NOT_FOUND });

    const board = await Board.findOne({ _id: boardId });
    if (!board) return res.json({ success: false, message: MESSAGES.BOARD.ERROR.NOT_FOUND });

    const task = await Task.findOne({
      _id: taskId,
      boardId,
      createdBy: userId,
    });
    if (!task) return res.json({ success: false, message: MESSAGES.TASK.ERROR.NOT_FOUND });
    let taskTitle = task.title;
    const result = await task.deleteOne();

    if (result?.acknowledged && result?.deletedCount > 0) {
      logActivity({
        user: userId,
        action: "deleted_task",
        board: boardId,
        task: task._id,
        message: `Deleted task *${taskTitle}* from board *${board.name}*`
      });
    }

    return res.json({ success: true, message: MESSAGES.TASK.SUCCESS.DELETED_SUCCESSFULLY });
  } catch (error) {

    console.log("An error occured in deleteTask function: ", error.message);
    return res.json({ success: false, message: MESSAGES.TASK.ERROR.DELETE_FAILED });
  }
};

export { create, getAllTasks, updateTask, deleteTask };
