import { Plus, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import NavbarSkeleton from "../skeletons/navbar/NavbarSkeleton";
import BoardStatusDropdown from "../ui/dropdown/BoardStatusDropdown";
import CreateTask from "../modals/create-task/CreateTask";

const Navbar = ({
  tasks,
  setTasks,
  boardDescription = "Manage your personal tasks and goals",
  statuses = ["active", "draft", "archived"],
  activeStatus,
  onStatusChange,
  boards,
  activeBoard,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // close task modal when click outside modal
  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (
        isTaskModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setIsTaskModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideModal);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideModal);
  }, [isTaskModalOpen]);

  // disable scroll when modal open
  useEffect(() => {
    if (isTaskModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isTaskModalOpen]);

  return (
    <>
      <div id="navbar" className="navbar">
        {/* Info */}
        <div className="navbar__info">
          <h1 className="navbar__title">Dashboard</h1>
          <p className="navbar__subtitle">{boardDescription}</p>
        </div>

        {/* Actions */}
        <div className="navbar__actions" ref={dropdownRef}>
          {/* Filter Boards */}
          <button
            className="navbar__change-status"
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            <RefreshCw className="navbar__change-status-icon" />
            <span className="navbar__change-status-text">Filter Boards</span>
          </button>

          {dropdownVisible && (
            <div className="navbar__actions-dropdown">
              <BoardStatusDropdown
                title="Board visibility"
                statuses={statuses}
                activeStatus={activeStatus}
                onStatusChange={(status) => {
                  onStatusChange(status);
                  setDropdownVisible(false);
                }}
              />
            </div>
          )}

          {/* Add Task */}
          <button
            className="navbar__add-task"
            onClick={() => setIsTaskModalOpen(true)}
          >
            <Plus className="navbar__add-task-icon" />
            <span className="navbar__add-task-text">Add Task</span>
          </button>
        </div>
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="task-modal-overlay">
          <div ref={modalRef}>
            <CreateTask
              tasks={tasks}
              setTasks={setTasks}
              activeBoard={activeBoard}
              boards={boards}
              onClose={() => setIsTaskModalOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
