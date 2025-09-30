import { Activity, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import "./Sidebar.css";
import { useState } from "react";
import { BOARDS } from "../../assets/data/boards.js";

const Sidebar = ({ activeBoard, onBoardChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

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
              <h1 className="sidebar__boards-title">Boards</h1>
              <Plus className="sidebar__boards-add" />
            </div>
            <ul className="sidebar__boards-list">
              {BOARDS.map((board) => (
                <li
                  key={board._id}
                  onClick={() => onBoardChange(board._id)}
                  className={`sidebar__board-item ${
                    activeBoard === board._id ? "sidebar__board-item--active" : ""
                  }`}
                >
                  {board.name}
                </li>
              ))}
            </ul>
          </div>
          {/* Activity Section */}
          <div className="sidebar__activity">
            <h1 className="sidebar__activity-title">Activity</h1>
            <div className="sidebar__activity-log">
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
    </div>
  );
};

export default Sidebar;