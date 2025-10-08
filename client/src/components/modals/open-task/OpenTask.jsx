import { useEffect, useState } from "react";
import { X, Pencil, Trash2, Send, ArrowRight } from "lucide-react";
import "./OpenTask.scss";
import { mockActivities } from "../../../assets/data/open-task.js";
import TaskDeleteConfirmationModal from "../confirm/task-delete/TaskDeleteConfirmationModal.jsx";
import axios from "axios";
import Message from "../../../components/ui/message/Message.jsx";
import moment from "moment";
import Comment from "../../../components/comment/Comment.jsx";

const OpenTask = ({
  isOpen = true,
  onClose = () => {},
  task = {},
  setTasks = () => {
    console.log("Something went wrong at BoardCard.jsx");
  },
}) => {
  const [activeTab, setActiveTab] = useState("activity");
  const [commentText, setCommentText] = useState("");
  const [editBoardName, setEditBoardName] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [updatedTaskTitle, setUpdatedTaskTitle] = useState(
    task?.title || "Something went wrong"
  );
  const [failureMessage, setFailureMessage] = useState({}); //failure message for update task title
  const [successMessage, setSuccessMessage] = useState({}); //failure message for update task title
  const [comments, setComments] = useState([]);
  const handleEditBoardName = () => {
    setEditBoardName(true);
  };

  const handleTaskUpdate = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/task/update/${
          task?.boardId || "something went wrong"
        }/${task?._id || "something went wrong"}`,
        { updatedTaskTitle },
        { withCredentials: true }
      );
      if (res?.data?.success) {
        setTasks((prev) =>
          prev.map((t) =>
            String(t._id) === String(task._id) &&
            String(t.boardId) === task.boardId
              ? { ...t, title: updatedTaskTitle }
              : t
          )
        );
        console.log(res.data?.message || "No message received");
        setFailureMessage({});
        setSuccessMessage({ type: "success", text: res?.data?.message });
      } else {
        console.log(res?.data?.message);
        setSuccessMessage({});
        setFailureMessage({ type: "failure", text: res?.data?.message });
      }
    } catch (error) {
      console.log(
        "An error occured in handleTaskUpdate in OpenTask.jsx: ",
        error.message
      );
    }
  };

  const getCommentsByTask = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/comment/task/${task._id}`,
        { withCredentials: true }
      );
      if (res?.data?.success) {
        console.log(res.data?.message);
        const commentsCopy = res.data?.comments || [];
        if (commentsCopy.length > 0) {
          const mappedComments = commentsCopy.map((comment) => ({
            ...comment,
            time: moment(comment.createdAt).fromNow(),
          }));
          setComments(mappedComments || []);
        }
      } else {
        console.log(res.data?.message);
      }
    } catch (error) {
      console.log(
        "An error occured in getCommentsByTask in OpenTask.jsx: ",
        error.message
      );
    }
  };

  const postComment = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/comment/create`,
        { taskId: task._id, commentText },
        { withCredentials: true }
      );

      if (res?.data?.success) {
        console.log(res.data?.message || "Operation successful");
        const updatedComment = res.data.comment;
        updatedComment["time"] = moment(updatedComment.createdAt).fromNow();
        setComments((prev) => [...prev, res.data.comment]);
        setCommentText("");
      } else {
        console.log(res.data?.message || "Operation failed");
      }
    } catch (error) {
      console.log(
        "An error occured in postComment in Opentask.jsx: ",
        error.message
      );
    }
  };
  useEffect(() => {
    if (activeTab === "comments") {
      getCommentsByTask();
    }
  }, [activeTab]);

  if (!isOpen) return null;

  return (
    <div className="open-task-overlay" onClick={onClose}>
      <div className="open-task-container" onClick={(e) => e.stopPropagation()}>
        {}
        <div className="open-task-header">
          <div className="open-task-header-content">
            <h2 className="open-task-title">{task?.title || "..."}</h2>
            <p className="open-task-desc">{task?.description || "..."}</p>
            <div className="open-task-meta">
              <span>Assigned to: {task?.assignee?.email || ".."}</span>
              <span className="open-task-user">
                <span className="user-avatar">
                  {" "}
                  {task.assignee?.name
                    ? task.assignee.name[0].toUpperCase()
                    : "U"}
                </span>{" "}
                {task?.assignee?.name}
              </span>
            </div>
          </div>
          <div className="open-task-actions">
            {!editBoardName ? (
              <Pencil
                onClick={() => setEditBoardName(true)}
                className="action-icon"
                size={20}
              />
            ) : (
              <div className="open-task-actions-input-container">
                <input
                  value={updatedTaskTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTaskUpdate();
                  }}
                  onChange={(e) => setUpdatedTaskTitle(e.target.value)}
                  placeholder="Update Board Name"
                  className="open-task-actions-input"
                />{" "}
                <div className="open-task-actions-icons-container">
                  {" "}
                  <X
                    onClick={() => {
                      setEditBoardName(false);
                      setFailureMessage({});
                    }}
                    className="open-task-actions-icon"
                    width={20}
                  />
                  <ArrowRight
                    onClick={handleTaskUpdate}
                    className="open-task-actions-icon"
                    width={20}
                  />
                </div>
                <Message
                  variant={
                    (failureMessage && "compact") || (successMessage && "full")
                  }
                  type={
                    (failureMessage && failureMessage.type) ||
                    (successMessage && successMessage.type)
                  }
                  text={
                    (failureMessage && failureMessage.text) ||
                    (successMessage && successMessage.text)
                  }
                />
              </div>
            )}
            <Trash2
              onClick={() => setShowModal(true)}
              className="action-icon"
              size={20}
            />
            <X className="action-icon close-icon" onClick={onClose} size={20} />
          </div>
        </div>

        {}
        <div className="open-task-tabs">
          <button
            className={`tab ${activeTab === "comments" ? "active" : ""}`}
            onClick={() => setActiveTab("comments")}
          >
            Comments
          </button>
          <button
            className={`tab ${activeTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            Activity
          </button>
        </div>

        {}
        <div className="open-task-content">
          {}
          {activeTab === "comments" && (
            <div className="open-task-comments">
              {comments &&
                comments.length > 0 &&
                comments.map((comment, i) => (
                  <Comment
                    key={i}
                    comment={comment}
                    setComments={setComments}
                    getCommentsByTask={getCommentsByTask}
                  />
                ))}

              <div className="add-comment">
                <div className="comment-avatar">JD</div>
                <div className="add-comment-wrapper">
                  <textarea
                    placeholder="Add a comment..."
                    className="comment-input"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {}
          {activeTab === "activity" && (
            <div className="open-task-activities">
              {mockActivities.map((a, i) => (
                <div key={i} className="activity-item">
                  <div className="comment-avatar">{a.avatar}</div>
                  <div className="activity-content">
                    <p className="activity-text">
                      <span className="activity-name">{a.name}</span> {a.action}
                    </p>
                    <span className="activity-time">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {}
        {activeTab === "comments" && (
          <div className="open-task-footer">
            <button onClick={postComment} className="comment-btn">
              <Send size={16} />
              Post Comment
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <TaskDeleteConfirmationModal
          title={"My Task"}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            console.log("Task deleted");
            setShowModal(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default OpenTask;
