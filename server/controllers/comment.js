import { Comment } from "../models/comment.js";
import { Task } from "../models/task.js";
import { User } from "../models/user.js";
import { validateString } from "../utils/string.js";
import { sanitizeObjectId } from "../utils/sanitizeObjectId.js";
import { comment } from "../utils/default-values/comment.js";
import { mapComment } from "../utils/mapper.js";

const createComment = async (req, res) => {
  let { taskId, commentText: content } = req.body || {};
  let { _id: authorId } = req.payload || {};
  const payload = req.payload;

  if (!taskId || !authorId)
    return res.json({ success: false, message: "Something went wrong" });

  const authorCheck = sanitizeObjectId(authorId);
  if (!authorCheck.success) {
    return res.json({
      success: authorCheck.success,
      message: authorCheck.message,
    });
  }
  authorId = authorCheck.validId;

  const taskCheck = sanitizeObjectId(taskId);
  if (!taskCheck.success) {
    return res.json({ success: taskCheck.success, message: taskCheck.message });
  }
  taskId = taskCheck.validId;

  if (String(content).length > comment.maxLength) {
    return res.json({
      success: false,
      message: "Content exceeds from specified words",
    });
  }

  let stringValidation = validateString(content);
  if (!stringValidation.success)
    return res.json({
      success: stringValidation.success,
      message: stringValidation.message,
    });

  if (String(content).length === 0) {
    return res.json({
      success: false,
      message: "Content is empty",
    });
  }
  try {
    const author = await User.exists({ _id: authorId });
    const task = await Task.exists({ _id: taskId });
    if (!task || !author)
      return res.json({
        success: false,
        message: "Task/Author not found either deleted or moved",
      });

    const existingComment = await Comment.findOne({
      //spam comment on same task of same author
      taskId,
      authorId,
      content,
    });
    if (existingComment)
      return res.json({ success: false, message: "Duplicate comment" });

    let newComment = await Comment.create({
      taskId,
      authorId,
      content,
    });
    newComment = await newComment.populate([
      {
        path: "authorId",
        select: "name",
      },
    ]);

    if (!newComment)
      return res.json({
        success: false,
        message: "Something went wrong. Try again",
      });
    console.log(newComment.authorId);
    console.log(payload._id);
    console.log(newComment);
    const updatedComment = {
      _id: newComment._id,
      avatar:
        newComment?.authorId.name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase() || "DN",
      name: newComment?.authorId.name || "Dummy Name",
      createdAt: newComment.createdAt,
      text: newComment.content,
      canEdit: String(newComment?.authorId._id) === String(payload._id),
      taskId: String(newComment.taskId),
    };

    return res.json({
      success: true,
      message: "Comment added",
      comment: updatedComment,
    });
  } catch (error) {
    console.log("An error occured in createComment function: ", error.message);
    return res.json({ success: false, message: "Error in create comment" });
  }
};

const getCommentsByTask = async (req, res) => {
  let { taskId } = req.params || {};
  const payload = req.payload;

  if (!taskId)
    return res.json({ success: false, message: "Task Id is required" });

  let taskCheck = sanitizeObjectId(taskId);
  if (!taskCheck.success)
    return res.json({ success: taskCheck.success, message: taskCheck.message });
  taskId = taskCheck.validId;

  const task = await Task.exists({ _id: taskId });
  if (!task)
    return res.json({
      success: false,
      message: "Task not found either moved or deleted",
    });

  try {
    const comments = await Comment.find({ taskId, isDeleted: false })
      .populate("authorId", "name")
      .lean();

    const finalComments = comments.map((comment) =>
      mapComment(comment, payload)
    );

    return res.json({
      success: true,
      message: "Comments fetched",
      comments: finalComments,
      length: comments.length,
    });
  } catch (error) {
    console.log(
      "An error occured in getCommentsByTask function: ",
      error.message
    );
    return res.json({ success: false, message: "Comments fetching failed" });
  }
};

const updateComment = async (req, res) => {
  let { taskId } = req.body || {};
  let { commentId } = req.params || {};
  const { updatedCommentText: updatedContent } = req.body || {};

  if (!taskId)
    return res.json({ success: false, message: "Task Id is required" });

  if (!commentId)
    return res.json({ success: false, message: "Comment Id is required" });

  let taskCheck = sanitizeObjectId(taskId);
  if (!taskCheck.success)
    return res.json({ success: taskCheck.success, message: taskCheck.message });
  taskId = taskCheck.validId;

  let commentCheck = sanitizeObjectId(commentId);
  if (!commentCheck.success)
    return res.json({
      success: commentCheck.success,
      message: commentCheck.message,
    });
  commentId = commentCheck.validId;

  const isBelongToTask = await Comment.exists({ _id: commentId, taskId });
  if (!isBelongToTask)
    return res.json({
      success: false,
      message:
        "Comment does not belong to the specified task or does not exist",
    });

  if (String(updatedContent).length > comment.maxLength) {
    return res.json({
      success: false,
      message: "Content exceeds from specified words",
    });
  }

  let stringValidation = validateString(updatedContent);
  if (!stringValidation.success)
    return res.json({
      success: stringValidation.success,
      message: stringValidation.message,
    });

  if (String(updatedContent).length === 0) {
    return res.json({
      success: false,
      message: "Content is empty",
    });
  }

  const existingComment = await Comment.findOne({ _id: commentId });
  if (!existingComment)
    return res.json({
      success: false,
      message: "Comment not found",
    });

  if (existingComment.isDeleted)
    return res.json({
      success: false,
      message: "Comment not found or may be deleted",
    });

  if (existingComment.authorId.toString() !== req.payload._id)
    return res.json({
      success: false,
      message: "You are not authorized to update this comment",
    });

  if (existingComment.content === updatedContent)
    return res.json({
      success: false,
      message: "Content unchanged",
    });

  const updatedComment = await Comment.findByIdAndUpdate(
    { _id: commentId },
    { $set: { content: updatedContent, isEdited: true, editedAt: new Date() } },
    { new: true }
  ).populate("authorId", "name");

  if (!updatedComment || !updatedComment.isEdited)
    return res.json({
      success: false,
      message: "Something went wrong. Try again",
    });

  console.log(updatedComment);

  return res.json({
    success: true,
    message: "Comment updated",
    updatedComment,
  });
};

const deleteComment = async (req, res) => {};

export { createComment, getCommentsByTask, updateComment, deleteComment };
