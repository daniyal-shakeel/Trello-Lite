import { useEffect, useState } from "react";
import { X, Pencil, Trash2, Send, ArrowRight } from "lucide-react";
import "./OpenTask.css";
import {
  mockComments,
  mockActivities,
} from "../../../assets/data/open-task.js";
import TaskDeleteConfirmationModal from "../confirm/task-delete/TaskDeleteConfirmationModal.jsx";

const OpenTask = ({ isOpen = true, onClose = () => {}, task = {} }) => {
  const [activeTab, setActiveTab] = useState("activity");
  const [commentText, setCommentText] = useState("");
  const [editBoardName, setEditBoardName] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editComment, setEditComment] = useState("");

  const [comments, setComments] = useState(mockComments || []);
  const handleEditBoardName = () => {
    setEditBoardName(true);
  };

  if (!isOpen) return null;

  return (
    <div className="open-task-overlay" onClick={onClose}>
      <div className="open-task-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="open-task-header">
          <div className="open-task-header-content">
            <h2 className="open-task-title">
              {task?.title || "Plan weekly meal prep"}
            </h2>
            <p className="open-task-desc">
              {task?.description || "Prepare healthy meals for the week ahead"}
            </p>
            <div className="open-task-meta">
              <span>Assigned to: </span>
              <span className="open-task-user">
                <span className="user-avatar">SM</span> Sarah Miller
              </span>
              <span className="meta-divider">Status:</span>
              <span className="open-task-status">To Do</span>
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setEditBoardName(false);
                  }}
                  placeholder="Update Board Name"
                  className="open-task-actions-input"
                />{" "}
                <div className="open-task-actions-icons-container">
                  {" "}
                  <X
                    onClick={() => setEditBoardName(false)}
                    className="open-task-actions-icon"
                    width={20}
                  />
                  <ArrowRight
                    onClick={() => setEditBoardName(false)}
                    className="open-task-actions-icon"
                    width={20}
                  />
                </div>
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

        {/* Tabs */}
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

        {/* Content Area */}
        <div className="open-task-content">
          {/* Comments Section */}
          {activeTab === "comments" && (
            <div className="open-task-comments">
              {comments.map((c, i) => (
                <div key={i} className="comment-item">
                  <div className="comment-avatar">{c.avatar}</div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-name">{c.name}</span>
                      <span className="comment-time">{c.time}</span>
                      {c.canEdit && (
                        <div className="comment-actions">
                          <Pencil
                            onClick={() =>
                              setEditComment((prev) =>
                                prev ? prev._id : c._id
                              )
                            }
                            size={16}
                          />
                          <Trash2
                            onClick={() =>
                              setComments((prev) =>
                                prev.filter((p) => p._id !== c._id)
                              )
                            }
                            size={16}
                          />
                        </div>
                      )}
                    </div>
                    <div className="comment-body">
                      {editComment === c._id ? (
                        <>
                          <textarea className="comment-edit-input">
                            {c.text}
                          </textarea>
                          <div className="comment-edit-actions">
                            <button
                              onClick={() => setEditComment("")}
                              className="comment-edit-btn cancel"
                            >
                              Cancel
                            </button>
                            <button className="comment-edit-btn save">
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
              ))}

              {/* Add new comment */}
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

          {/* Activity Section */}
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

        {/* Footer - Post Comment Button */}
        {activeTab === "comments" && (
          <div className="open-task-footer">
            <button
              onClick={() =>
                setComments((prev) => [
                  ...prev,
                  {
                    _id: "c1",
                    avatar: "JD",
                    name: "John Doe",
                    time: "1 day ago",
                    text: commentText,
                    canEdit: true,
                  },
                ])
              }
              className="comment-btn"
            >
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
