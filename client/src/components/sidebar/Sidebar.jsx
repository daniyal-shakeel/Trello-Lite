import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Plus,
  UserPlus,
} from "lucide-react";
import "./Sidebar.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarSkeleton from "../skeletons/sidebar/SidebarSkeleton.jsx";
import AddCollaborator from "../modals/add-collaborators/AddCollaborator.jsx";

const Sidebar = ({ activeBoard, onBoardChange, boardLoading, boards }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const [onAddBoard, setOnAddBoard] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collaborators, setCollaborators] = useState([]);

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
                  <span className="sidebar__board-item-icon">
                    <UserPlus
                      onClick={handleAddBoardCollaboratorIconClick}
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
    </div>
  );
};

export default Sidebar;
