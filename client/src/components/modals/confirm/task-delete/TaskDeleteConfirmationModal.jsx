import { AlertTriangle } from "lucide-react";
import "./TaskDeleteConfirmationModal.css";

const BoardDeleteConfirmationModal = ({
  title,
  isOpen = true,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div
        className="delete-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-modal-icon">
          <AlertTriangle size={48} />
        </div>

        <h2 className="delete-modal-title">Delete Task</h2>

        <p className="delete-modal-message">
          Are you sure you want to delete <strong>"{title}"</strong> task? This
          action cannot be undone and will remove all comments and activity
          history.
        </p>

        <div className="delete-modal-actions">
          <button className="delete-modal-btn cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-modal-btn confirm-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardDeleteConfirmationModal;
