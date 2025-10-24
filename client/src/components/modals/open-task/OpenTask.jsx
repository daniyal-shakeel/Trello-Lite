import { useEffect, useState } from "react";
import { X, Pencil, Trash2, Send, ArrowRight } from "lucide-react";
import "./OpenTask.scss";
import TaskDeleteConfirmationModal from "../confirm/task-delete/TaskDeleteConfirmationModal.jsx";
import axios from "axios";
import Message from "../../../components/ui/message/Message.jsx";
import moment from "moment";
import Comment from "../../../components/comment/Comment.jsx";
import { getApiUri } from "../../../utils/getUri.js";
import CommentsSkeleton from "../../skeletons/comments/CommentsSkeleton.jsx";
import Activity from "../../activity/Activity.jsx";
import ActivityComponentSkeleton from "../../skeletons/activity-component/ActivityComponentSkeleton.jsx";

const OpenTask = ({
  isOpen = true,
  onClose = () => {},
  task = {},
  setTasks = () => {},
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

  const [loadingComments, setLoadingComments] = useState(false);

  const [activities, setActivities] = useState([]);
  const [activityResponses, setActivityResponses] = useState({});
  const [loadingActivities, setLoadingActivities] = useState(false);
  const handleEditBoardName = () => {
    setEditBoardName(true);
  };

  const handleTaskUpdate = async () => {
    try {
      const res = await axios.put(
        getApiUri(`/api/task/update/${task?.boardId || ""}/${task?._id || ""}`),
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
        setFailureMessage({});
        setSuccessMessage({ type: "success", text: res?.data?.message });
      } else {
        setSuccessMessage({});
        setFailureMessage({ type: "failure", text: res?.data?.message });
      }
    } catch (error) {
      console.log(
        error.message
      );
    }
  };

  const getActivitiesByTask = async () => {
    setLoadingActivities(true);
    try {
      const res = await axios.get(getApiUri(`/api/activity/task/${task._id}`), {
        withCredentials: true,
      });

      if (res?.data?.success) {
        setActivities(res.data.activities || []);
        setActivityResponses(res.data.activityResponses || {});
        } 
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingActivities(false);
    }
  };

  const getCommentsByTask = async () => {
    setLoadingComments(true);
    try {
      const res = await axios.get(getApiUri(`/api/comment/task/${task._id}`), {
        withCredentials: true,
      });
      if (res?.data?.success) {
        const commentsCopy = res.data?.comments || [];
        if (commentsCopy.length > 0) {
          const mappedComments = commentsCopy.map((comment) => ({
            ...comment,
            time: moment(comment.createdAt).fromNow(),
          }));
          setComments(mappedComments || []);
        }
      } 
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const postComment = async () => {
    try {
      const res = await axios.post(
        getApiUri("/api/comment/create"),
        { taskId: task._id, commentText },
        { withCredentials: true }
      );

      if (res?.data?.success) {
        const updatedComment = res.data.comment;
        updatedComment["time"] = moment(updatedComment.createdAt).fromNow();
        setComments((prev) => [...prev, res.data.comment]);
        setCommentText("");
      } 
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleDeleteTask = async () => {
    try {
      const res = await axios.delete(
        getApiUri(`/api/task/delete/${task.boardId}/${task._id}`),
        { withCredentials: true }
      );
      if (res?.data?.success) {
        setTasks((prev) => prev.filter((t) => t._id !== task._id));
        setShowModal(false);
        onClose();
      } 
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (activeTab === "comments") {
      getCommentsByTask();
    } else if (activeTab === "activity") {
      getActivitiesByTask();
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
              {!loadingComments
                ? comments.map((comment, i) => (
                    <Comment
                      key={i}
                      comment={comment}
                      setComments={setComments}
                      getCommentsByTask={getCommentsByTask}
                    />
                  ))
                : [1, 2].map((_, i) => <CommentsSkeleton key={i} />)}
              {!loadingComments && comments.length === 0 && (
                <div className="no-comments">No comments yet.</div>
              )}

              <div className="add-comment">
                <div className="comment-avatar">JD</div>
                <div className="add-comment-wrapper">
                  <textarea
                    placeholder="Add a comment..."
                    className="comment-input"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) {
                        e.preventDefault();
                        postComment();
                      }
                    }}
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {}
          {activeTab === "activity" && (
            <div className="open-task-activities">
              {loadingActivities ? (
                [1, 2, 3].map((_, i) => <ActivityComponentSkeleton key={i} />)
              ) : activities.length > 0 ? (
                activities
                  ?.slice()
                  .sort((a, b) => new Date(b.time) - new Date(a.time))
                  .map((a, i) => (
                    <Activity
                      key={i}
                      avatar={a.avatar}
                      name={a.name}
                      action={a.action}
                      time={a.time}
                      activityResponses={activityResponses}
                    />
                  ))
              ) : (
                <div className="no-activity">No activity yet.</div>
              )}
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
            <span className="open-task-footer__shortcut-hint">
              Press Ctrl+Enter to post
            </span>
          </div>
        )}
      </div>

      {showModal && (
        <TaskDeleteConfirmationModal
          title={"My Task"}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default OpenTask;
