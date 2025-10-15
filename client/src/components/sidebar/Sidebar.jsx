import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";
import "./Sidebar.scss";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SidebarSkeleton from "../skeletons/sidebar/SidebarSkeleton.jsx";
import AddCollaborator from "../modals/add-collaborators/AddCollaborator.jsx";
import BoardDeleteConfirmationModal from "../modals/confirm/board-delete/BoardDeleteConfirmationModal.jsx";
import axios from "axios";
import Message from "../ui/message/Message.jsx";
import { getInitials } from "../../utils/getInitials.js";
import Tooltip from "../ui/tooltip/Tooltip.jsx";
import ModalPortal from "../modals/modal-portal/ModalPortal.jsx";
import { getApiUri } from "../../utils/getUri.js";

const Sidebar = ({
  activeBoard,
  onBoardChange,
  boardLoading,
  boards,
  setBoards,
  setAuth,
  user,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const [onAddBoard, setOnAddBoard] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);
  const [error, setError] = useState("");

  const [tooltip, setTooltip] = useState(false);

  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleAddBoardCollaboratorIconClick = (e, board) => {
    e.stopPropagation();
    setSelectedBoard(board);
    setIsModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get(getApiUri("/api/user/logout"), {
        withCredentials: true,
      });
      if (res.data.success) {
        setAuth(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const createBoard = async () => {
    if (!boardName.trim()) {
      setError("Board name cannot be empty.");
      return;
    }
    try {
      const res = await axios.post(
        getApiUri("/api/board/create-board"),
        { name: boardName },
        { withCredentials: true }
      );
      if (res.data.success) {
        setBoards((prev) => [...prev, res.data.board]);
        setBoardName("");
        setOnAddBoard(false);
        setError("");
      } else {
        setError(res.data.message || "Failed to create board.");
      }
    } catch (error) {
      setError(error.message || "An error occurred while creating the board.");
    }
  };

  const addCollaborators = async (boardId, collaborators) => {
    console.log(boardId);
    try {
      const res = await axios.post(
        getApiUri(`/api/board/collaborators/add/${boardId}`),
        { collaborators },
        { withCredentials: true }
      );

      if (res.data.success) {
        console.log("Collaborators added:", res.data.message);
        setBoards((prev) =>
          prev.map((b) =>
            b._id === boardId
              ? { ...b, collaborators: res.data.collaborators }
              : b
          )
        );

        setCollaborators([]);
        return true;
      } else {
        console.error("Failed to add collaborators:", res.data.message);
        return false;
      }
    } catch (error) {
      console.error("An error occurred in AddCollaborators:", error.message);
      return false;
    }
  };

  useEffect(() => {
    if (onAddBoard && inputRef.current) inputRef.current.focus();
  }, [onAddBoard]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        onAddBoard
      ) {
        setOnAddBoard(false);
        setBoardName("");
        setError("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onAddBoard]);

  useEffect(() => {
    if (!isModalOpen) {
      setCollaborators([]);
      setSelectedBoard(null);
    }
  }, [isModalOpen]);

  useEffect(() => console.log(boards), [boards]);

  if (boardLoading) return <SidebarSkeleton />;

  return (
    <div id="sidebar" className={`sidebar ${!isOpen ? "sidebar--closed" : ""}`}>
      {}
      <div className="sidebar__header">
        <h1 className="sidebar__brand">TrelloLite</h1>
        <p className="sidebar__tagline">Task Management</p>
      </div>

      {isOpen && (
        <>
          {/* Owned boards */}
          <div className="sidebar__boards">
            <div className="sidebar__boards-header">
              {!onAddBoard && <h1 className="sidebar__boards-title">Boards</h1>}
              {onAddBoard ? (
                <div ref={wrapperRef} className="sidebar__boards-input-wrapper">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter board name"
                    className="sidebar__boards-input"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") createBoard();
                      if (e.key === "Escape") {
                        setOnAddBoard(false);
                        setBoardName("");
                        setError("");
                      }
                    }}
                    onMouseOver={() => setTooltip(true)}
                    onMouseLeave={() => setTooltip(false)}
                  />
                  <button
                    className="sidebar__boards-input-btn"
                    onClick={createBoard}
                  >
                    ➔
                  </button>
                  {tooltip && (
                    <Tooltip
                      text="Press Enter to save, Esc to cancel"
                      visible={tooltip}
                    />
                  )}
                </div>
              ) : (
                <Plus
                  onClick={() => {
                    setOnAddBoard(true);
                    setError("");
                  }}
                  className="sidebar__boards-add"
                />
              )}
            </div>

            {onAddBoard && error && <Message type="failure" text={error} />}

            <ul className="sidebar__boards-list">
              {[...boards]
                .filter((board) => !board.isShared)
                .sort((a, b) =>
                  a._id === activeBoard ? -1 : b._id === activeBoard ? 1 : 0
                )
                .map((board) => (
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
                        onClick={(e) =>
                          handleAddBoardCollaboratorIconClick(e, board)
                        }
                        width={20}
                      />
                      <Trash2
                        onClick={(e) => {
                          e.stopPropagation();
                          setBoardToDelete(board);
                          setShowConfirmationModal(true);
                        }}
                        width={20}
                      />
                    </span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Shared boards */}
          <div className="sidebar__boards">
            <div className="sidebar__boards-header">
              <h1 className="sidebar__boards-title">Shared boards</h1>
            </div>

            <ul className="sidebar__boards-list">
              {boards
                .filter((board) => board.isShared) // only shared boards
                .sort((a, b) =>
                  a._id === activeBoard ? -1 : b._id === activeBoard ? 1 : 0
                )
                .map((board) => (
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
                  </li>
                ))}
            </ul>
            {boards.filter((b) => b.isShared).length === 0 && (
              <p className="no-shared-boards">No shared boards</p>
            )}
          </div>

          {}
          <div className="sidebar__activity">
            <h1 className="sidebar__activity-title">Activity</h1>
            <div
              onClick={() => navigate("/activity")}
              className="sidebar__activity-log"
            >
              <Activity className="sidebar__activity-icon" />
              <span className="sidebar__activity-text">Activity Log</span>
            </div>
          </div>

          {}
          <div className="sidebar__profile">
            <div className="sidebar__profile-avatar">
              {(() => getInitials(user?.name))()}
            </div>
            <div className="sidebar__profile-info">
              <h1 className="sidebar__profile-name">
                {user?.name || "Guest User"}
              </h1>
              <p className="sidebar__profile-email">
                {user?.email || "guest@example.com"}
              </p>
            </div>
          </div>

          {}
          <button className="sidebar__logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </>
      )}

      {}
      <button onClick={handleToggle} className="sidebar__toggle-btn">
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {}
      {isModalOpen && selectedBoard && (
        <ModalPortal>
          <AddCollaborator
            activeBoard={activeBoard}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            collaborators={collaborators}
            setCollaborators={setCollaborators}
            onConfirm={async (finalCollaborators) => {
              return await addCollaborators(
                selectedBoard._id,
                finalCollaborators
              );
            }}
          />
        </ModalPortal>
      )}

      {}
      {showConfirmationModal && boardToDelete && (
        <ModalPortal>
          {" "}
          <BoardDeleteConfirmationModal
            title={boardToDelete.name}
            boardId={boardToDelete._id}
            activeBoard={activeBoard}
            onBoardChange={onBoardChange}
            setBoards={setBoards}
            isOpen={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
          />
        </ModalPortal>
      )}
    </div>
  );
};

export default Sidebar;
