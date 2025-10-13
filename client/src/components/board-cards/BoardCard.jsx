import { useState, useRef, useEffect } from "react";
import Task from "../task/Task";
import "./BoardCard.css";
import BoardCardSkeleton from "../skeletons/board-card/BoardCardSkeleton";
import { GripVertical, MoreVertical } from "lucide-react";
import BoardStatusDropdown from "../ui/dropdown/BoardStatusDropdown";
import axios from "axios";
import { getApiUri } from "../../utils/getUri";

const BoardCard = ({
  name,
  boardId,
  status = "",
  tasks = [],
  setTasks = () => {},
  setBoards = () => {},
  loading = false,
  isShared,
  activeBoard, // selected board id
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChangeStatus = async (newStatus) => {
    try {
      const response = await axios.post(
        getApiUri(`/api/board/change-status/${newStatus}`),
        { boardId },
        { withCredentials: true }
      );

      if (response.data.success) {
        setCurrentStatus(newStatus);
        setBoards((prevBoards) =>
          prevBoards.map((b) =>
            b._id === boardId ? { ...b, status: newStatus } : b
          )
        );
      } else {
        console.error(response.data.message);
      }

      setDropdownOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return <BoardCardSkeleton />;
  }

  const isActiveBoard = boardId === activeBoard;

  return (
    <div
      id="board"
      className={`board ${!isActiveBoard ? "board--disabled" : ""}`}
    >
      <div className="board__drag-icon-container">
        <GripVertical className="board__drag-icon" />
      </div>
      <div className="board__header">
        <div className="board__status-container">
          {isShared && <span className="board__shared-badge">Shared</span>}
          <h1 className="board__status">{name}</h1>
        </div>
        <div className="board__actions">
          <p className="board__count">{tasks.length}</p>
          <div className="dropdown-wrapper" ref={dropdownRef}>
            <button
              className="board__menu-btn"
              disabled={!isActiveBoard}
              onClick={() => {
                if (isActiveBoard) {
                  setDropdownOpen((prev) => !prev);
                }
              }}
            >
              {!isShared && <MoreVertical size={18} />}
            </button>
            {dropdownOpen && isActiveBoard && (
              <BoardStatusDropdown
                title="Change Status"
                statuses={["active", "draft", "archived"]}
                activeStatus={currentStatus}
                onStatusChange={handleChangeStatus}
              />
            )}
          </div>
        </div>
      </div>

      <div className="board__tasks">
        {tasks.map((task) => (
          <Task key={task._id} task={task} setTasks={setTasks} />
        ))}
      </div>
    </div>
  );
};

export default BoardCard;
