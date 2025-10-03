import { Plus, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import NavbarSkeleton from "../skeletons/navbar/NavbarSkeleton";
import BoardStatusDropdown from "../ui/dropdown/BoardStatusDropdown";

const Navbar = ({
  boardDescription = "Manage your personal tasks and goals",
  taskLoading,
  statuses = ["active", "draft", "archived"],
  activeStatus,
  onStatusChange,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (taskLoading) {
    return <NavbarSkeleton />;
  }

  return (
    <div id="navbar" className="navbar">
      {}
      <div className="navbar__info">
        <h1 className="navbar__title">Dashboard</h1>
        <p className="navbar__subtitle">{boardDescription}</p>
      </div>

      {}
      <div className="navbar__actions" ref={dropdownRef}>
        {}
        <button
          className="navbar__change-status"
          onClick={() => setDropdownVisible(!dropdownVisible)}
        >
          <RefreshCw className="navbar__change-status-icon" />
          <span className="navbar__change-status-text">Change Status</span>
        </button>

        {}
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

        {}
        <button className="navbar__add-task">
          <Plus className="navbar__add-task-icon" />
          <span className="navbar__add-task-text">Add Task</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
