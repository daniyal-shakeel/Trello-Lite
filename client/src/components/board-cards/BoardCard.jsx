import { useState, useRef, useEffect } from "react";
import Task from "../task/Task";
import "./BoardCard.css";
import BoardCardSkeleton from "../skeletons/board-card/BoardCardSkeleton";
import { MoreVertical } from "lucide-react";
import BoardStatusDropdown from "../ui/dropdown/BoardStatusDropdown";
import axios from "axios";

const BoardCard = ({ name, boardId, status = "To Do", tasks = [] }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const dropdownRef = useRef(null);

  const filteredTasks = tasks.filter((task) => task.status === currentStatus);

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
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/board/change-status/${newStatus}`,
        { boardId },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log(response.data.message);
        setCurrentStatus(newStatus); 
      } else {
        console.error(response.data.message);
      }

      setDropdownOpen(false); 
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div id="board" className="board">
      {}
      <div className="board__header">
        <h1 className="board__status">{name}</h1>
        <div className="board__actions">
          <p className="board__count">{filteredTasks.length}</p>

          {}
          <div className="dropdown-wrapper" ref={dropdownRef}>
            <button
              className="board__menu-btn"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <MoreVertical size={18} />
            </button>

            {dropdownOpen && (
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

      {}
      <div className="board__tasks">
        {filteredTasks.map((task) => (
          <Task
            key={task._id}
            title={task?.title}
            description={task?.description}
            avatar={task?.avatar}
            name={task?.name}
            time={task?.time}
            color={task?.color}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardCard;
