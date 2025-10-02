import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";
import "./Sidebar.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarSkeleton from "../skeletons/sidebar/SidebarSkeleton.jsx";
import AddCollaborator from "../modals/add-collaborators/AddCollaborator.jsx";
import BoardDeleteConfirmationModal from "../modals/confirm/board-delete/BoardDeleteConfirmationModal.jsx";

const Sidebar = ({ activeBoard, onBoardChange, boardLoading, boards }) => {
  const [isOpen, setIsOpen] = useState(true); // this is the state of the collapse sidebar
  const navigate = useNavigate();
  const [onAddBoard, setOnAddBoard] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // this is the state of add collaborators modal
  const [collaborators, setCollaborators] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // this is the state of board delete confirmation modal

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleAddBoardCollaboratorIconClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const addBoardAPI = () => {
    console.log({ boardName });
  };

  const fetchBoardsAPI = () => {};

  useEffect(() => {
    if (!isModalOpen) {
      setCollaborators([]);
    }
  }, [isModalOpen]);

  if (boardLoading) return <SidebarSkeleton />;

  return (
    <div id="sidebar" className={`sidebar ${!isOpen ? "sidebar--closed" : ""}`}>
      {/* Header */}
      <div className="sidebar__header">
        <h1 className="sidebar__brand">TrelloLite</h1>
        <p className="sidebar__tagline">Task Management</p>
      </div>

      {isOpen && (
        <>
          {/* Boards Section */}
          <div className="sidebar__boards">
            <div className="sidebar__boards-header">
              {!onAddBoard && <h1 className="sidebar__boards-title">Boards</h1>}
              {onAddBoard ? (
                <div className="sidebar__boards-input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter board name"
                    className="sidebar__boards-input"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        console.log("Board name:", boardName);
                        setBoardName("");
                        setOnAddBoard(false);
                      }
                    }}
                  />
                  <button
                    className="sidebar__boards-input-btn"
                    onClick={() => {
                      console.log("Board name:", boardName);
                      setBoardName("");
                      setOnAddBoard(false);
                    }}
                  >
                    ➔
                  </button>
                </div>
              ) : (
                <Plus
                  onClick={() => setOnAddBoard(true)}
                  className="sidebar__boards-add"
                />
              )}
            </div>
            <ul className="sidebar__boards-list">
              {boards.map((board) => (
                <li
                  key={board._id}
                  onClick={() => onBoardChange(board._id)}
                  className={`sidebar__board-item ${
                    activeBoard === board._id
                      ? "sidebar__board-item--active"
                      : ""
                  }`}
                >
                  {board.name}
                  <span className="sidebar__board-item-icons">
                    <UserPlus
                      onClick={handleAddBoardCollaboratorIconClick}
                      width={20}
                    />
                    <Trash2
                      onClick={() => setShowConfirmationModal(true)}
                      width={20}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Activity Section */}
          <div className="sidebar__activity">
            <h1 className="sidebar__activity-title">Activity</h1>
            <div
              onClick={() => navigate("/activity-logs")}
              className="sidebar__activity-log"
            >
              <Activity className="sidebar__activity-icon" />
              <span className="sidebar__activity-text">Activity Log</span>
            </div>
          </div>
          {/* User Profile */}
          <div className="sidebar__profile">
            <div className="sidebar__profile-avatar">JD</div>
            <div className="sidebar__profile-info">
              <h1 className="sidebar__profile-name">John Doe</h1>
              <p className="sidebar__profile-email">john@example.com</p>
            </div>
          </div>
        </>
      )}
      {/* Toggle Button */}
      <button onClick={handleToggle} className="sidebar__toggle-btn">
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {isModalOpen && (
        <AddCollaborator
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          collaborators={collaborators}
          setCollaborators={setCollaborators}
          onConfirm={(finalCollaborators) => {
            console.log(
              "Final collaborators to send to API:",
              finalCollaborators
            );
            // Example:
            // addCollaboratorsAPI(boardId, finalCollaborators);
          }}
        />
      )}

      {showConfirmationModal && (
        <BoardDeleteConfirmationModal
          title="My Board Name"
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={() => {
            // Delete board logic here
            console.log("Board deleted");
            setShowConfirmationModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Sidebar;
