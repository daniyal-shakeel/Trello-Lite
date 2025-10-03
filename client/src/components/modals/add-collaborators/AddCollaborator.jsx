import "./AddCollaborator.css";
import { ArrowDown, ArrowDown01, ArrowRight, UserPlus, X } from "lucide-react";
import { useState } from "react";

const AddCollaborator = ({
  isOpen,
  onClose,
  collaborators,
  setCollaborators,
  onConfirm,
}) => {
  const [input, setInput] = useState("");

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

  const handleConfirm = () => {
    if (collaborators.length === 0) return;
    onConfirm(collaborators); 
    onClose(); 
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Collaborators <UserPlus /></h2>
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

          {}
          {collaborators.length > 0 && (
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
          )}
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
