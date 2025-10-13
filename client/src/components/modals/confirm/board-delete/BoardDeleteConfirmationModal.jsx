import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import axios from "axios";
import "./BoardDeleteConfirmationModal.css";
import Message from "../../../ui/message/Message";
import { getApiUri } from "../../../../utils/getUri";

const BoardDeleteConfirmationModal = ({
  title,
  boardId,
  activeBoard,
  onBoardChange,
  setBoards,
  isOpen = true,
  onClose,
}) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        getApiUri(`/api/board/delete-board/${boardId}`),
        { withCredentials: true }
      );
      console.log(res.data);

      if (res.data.success) {
        setBoards((prev) => prev.filter((b) => b._id !== boardId));
        if (activeBoard === boardId) onBoardChange(null);
        onClose()
      } else {
        setMessage(res.data.message || "Failed to delete board");
        setMessageType("failure");
      }
    } catch (error) {
      console.error("Delete board error:", error.message);
      setMessage("An error occurred while deleting board");
      setMessageType("error");
    }
  };

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div
        className="delete-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-modal-icon">
          <AlertTriangle size={48} />
        </div>

        <h2 className="delete-modal-title">Delete Board</h2>

        <p className="delete-modal-message">
          Are you sure you want to delete <strong>"{title}"</strong> board? This
          action cannot be undone and will remove all tasks, comments, and
          activity history.
        </p>

        {}
        <Message type={messageType} text={message} />

        <div className="delete-modal-actions">
          <button className="delete-modal-btn cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="delete-modal-btn confirm-btn"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardDeleteConfirmationModal;
