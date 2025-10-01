import { Plus } from "lucide-react";
import "./Navbar.css";
import NavbarSkeleton from "../skeletons/navbar/NavbarSkeleton"

const Navbar = ({ boardName = "Personal Board", boardDescription = "Manage your personal tasks and goals", taskLoading }) => {
  if (taskLoading) {
    return <NavbarSkeleton />;
  }
  return (
    <div id="navbar" className="navbar">
      {/* Left Section: Title + Subtitle */}
      <div className="navbar__info">
        <h1 className="navbar__title">{boardName}</h1>
        <p className="navbar__subtitle">{boardDescription}</p>
      </div>

      {/* Right Section: Action Button */}
      <button className="navbar__add-task">
        <Plus className="navbar__add-task-icon" />
        <span className="navbar__add-task-text">Add Task</span>
      </button>
    </div>
  );
};

export default Navbar;