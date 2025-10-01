import { useState } from "react";
import { X, Pencil, Trash2, Send } from "lucide-react";
import "./OpenTask.css"

// Mock data
const mockComments = [
  {
    avatar: "JD",
    name: "John Doe",
    time: "1 day ago",
    text: "hello",
    isCurrentUser: true
  },
  {
    avatar: "SM",
    name: "Sarah Miller",
    time: "2 days ago",
    text: "I'll start working on this today!",
    isCurrentUser: false
  }
];

const mockActivities = [
  {
    avatar: "JD",
    name: "John Doe",
    time: "1 day ago",
    action: "commented on task \"Plan weekly meal prep\""
  },
  {
    avatar: "SM",
    name: "Sarah Miller",
    time: "2 days ago",
    action: "commented on task \"Plan weekly meal prep\""
  },
  {
    avatar: "SM",
    name: "Sarah Miller",
    time: "3 days ago",
    action: "was assigned to this task"
  },
  {
    avatar: "JD",
    name: "John Doe",
    time: "3 days ago",
    action: "created this task"
  }
];

const OpenTask = ({ isOpen = true, onClose = () => {}, task = {} }) => {
  const [activeTab, setActiveTab] = useState("activity");
  const [commentText, setCommentText] = useState("");

  if (!isOpen) return null;

  return (
    <div className="open-task-overlay" onClick={onClose}>
      <div className="open-task-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="open-task-header">
          <div className="open-task-header-content">
            <h2 className="open-task-title">{task?.title || "Plan weekly meal prep"}</h2>
            <p className="open-task-desc">{task?.description || "Prepare healthy meals for the week ahead"}</p>
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
            <Pencil className="action-icon" size={20} />
            <Trash2 className="action-icon" size={20} />
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
              {mockComments.map((c, i) => (
                <div key={i} className="comment-item">
                  <div className="comment-avatar">{c.avatar}</div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-name">{c.name}</span>
                      <span className="comment-time">{c.time}</span>
                      {c.isCurrentUser && (
                        <div className="comment-actions">
                          <Pencil size={16} />
                          <Trash2 size={16} />
                        </div>
                      )}
                    </div>
                    <div className="comment-body">
                      <p className="comment-text">{c.text}</p>
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
            <button className="comment-btn">
              <Send size={16} />
              Post Comment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenTask;