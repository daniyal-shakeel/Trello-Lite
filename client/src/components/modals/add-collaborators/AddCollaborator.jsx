import "./AddCollaborator.css";
import { ArrowRight, UserPlus, X } from "lucide-react";
import { useState, useEffect } from "react";
import Message from "../../ui/message/Message.jsx";
import axios from "axios";
import { getApiUri } from "../../../utils/getUri.js";
import CollaboratorsSkeleton from "../../skeletons/collaborators/CollaboratorsSkeleton.jsx";

const AddCollaborator = ({
  isOpen,
  onClose,
  collaborators,
  setCollaborators,
  onConfirm,
  activeBoard,
}) => {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  const getAllCollaborators = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        getApiUri(
          `/api/board/collaborators/get-all-collaborators/${activeBoard}`
        ),
        { withCredentials: true }
      );

      if (res?.data?.success) {
        setCollaborators(
          res.data?.collaborators.map((collab) => collab.collaborator.email)
        );
      } 
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!input.trim()) return;
    const newCollaborators = input
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    setCollaborators([...collaborators, ...newCollaborators]);
    setInput("");
  };

  const handleRemove = (name) => {
    setCollaborators(collaborators.filter((c) => c !== name));
  };

  const handleConfirm = async () => {
    if (collaborators.length === 0) {
      setMessage({
        type: "failure",
        text: "Please add at least one collaborator.",
      });
      return;
    }
    try {
      const success = await onConfirm(collaborators);
      if (success) {
        setMessage({
          type: "success",
          text: "Collaborators added successfully!",
        });
      } else {
        setMessage({ type: "failure", text: "Failed to add collaborators." });
      }
    } catch (err) {
      setMessage({
        type: "failure",
        text: err.message || "An error occurred.",
      });
    }
  };

  useEffect(() => {
    getAllCollaborators();
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            Add Collaborators <UserPlus />
          </h2>
          <X className="modal-close" onClick={onClose} />
        </div>

        <div className="modal-body">
          <div className="input-with-btn">
            <input
              type="text"
              placeholder="Enter email(s) or username(s), separated by commas"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="modal-input"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
            />
            <button
              className="modal-input-btn"
              onClick={handleAdd}
              type="button"
            >
              <ArrowRight />
            </button>
          </div>

          {/* Loading skeleton */}
          {loading ? (
            <ul className="collaborators-list">
              {[...Array(4)].map((_, i) => (
                <li key={i}>
                  <CollaboratorsSkeleton />
                </li>
              ))}
            </ul>
          ) : (
            collaborators.length > 0 && (
              <ul className="collaborators-list">
                {collaborators.map((c, i) => (
                  <li key={i} className="collaborator-item">
                    <span>{c}</span>
                    <X
                      className="collaborator-remove"
                      onClick={() => handleRemove(c)}
                    />
                  </li>
                ))}
              </ul>
            )
          )}

          <Message type={message.type} text={message.text} />
        </div>

        <div className="modal-footer">
          <button className="modal-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn add" onClick={handleConfirm}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCollaborator;
