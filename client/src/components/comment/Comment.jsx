import "./Comments.scss";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
const Comment = ({
  comment: c,
  setComments = () => console.log("Somehing went wrong"),
  getCommentsByTask,
}) => {
  const [editComment, setEditComment] = useState("");
  const [updatedCommentText, setUpdatedCommentText] = useState(
    c.text ?? "something went wrong"
  );

  const handleUpdateComment = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/comment/update/${c._id || ""}`,
        { updatedCommentText, taskId: c.taskId },
        { withCredentials: true }
      );
      if (res?.data?.success) {
        setEditComment("");
        setUpdatedCommentText(res.data.updatedComment.content);
        console.log(res.data?.message || "Operation successful");

        getCommentsByTask();
      } else {
        console.log(res.data?.message || "Error occured in update comment");
      }
    } catch (error) {
      console.log(
        "An error occured in handleUpdateComment function in components/Comment.jsx: ",
        error.message
      );
    }
  };

  const handleDeleteComment = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/comment/delete/${c.taskId}/${
          c._id
        }`,
        { withCredentials: true }
      );
      if (res?.data?.success) {
        setComments((prev) => prev.filter((p) => p._id !== c._id));
        console.log(res.data?.message || "Operation successful");
      } else {
        console.log(res.data?.message || "Operation failed");
      }
    } catch (error) {
      console.log("An error occured in handleDeleteComment function: ");
    }
  };

  if (!c) return null;
  return (
    <div className="comment-item">
      <div className="comment-avatar">{c.avatar}</div>
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-name">{c.name}</span>
          <span className="comment-time">{c.time}</span>
          {c.canEdit && (
            <div className="comment-actions">
              <Pencil
                onClick={() =>
                  setEditComment((prev) => {
                    console.log(c);
                    console.log(prev);
                    if (prev) {
                      return prev._id;
                    } else {
                      return c._id;
                    }
                  })
                }
                size={16}
              />
              <Trash2 onClick={handleDeleteComment} size={16} />
            </div>
          )}
        </div>
        <div className="comment-body">
          {editComment === c._id ? (
            <>
              <textarea
                onChange={(e) => setUpdatedCommentText(e.target.value)}
                className="comment-edit-input"
              >
                {updatedCommentText}
              </textarea>
              <div className="comment-edit-actions">
                <button
                  onClick={() => setEditComment("")}
                  className="comment-edit-btn cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateComment}
                  className="comment-edit-btn save"
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <p className="comment-text">{c.text}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
