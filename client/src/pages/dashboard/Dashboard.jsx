import BoardCard from "../../components/board-cards/BoardCard";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { TASKS } from "../../assets/data/tasks";
import { BOARDS } from "../../assets/data/boards";
import "./Dashboard.css";
import { useState, useMemo } from "react";

const Dashboard = () => {
  const [activeBoard, setActiveBoard] = useState(BOARDS[0]?._id || null);
  const filteredTasks = useMemo(() => {
    return TASKS.filter((task) => task.boardId === activeBoard);
  }, [activeBoard]);
  const statuses = useMemo(() => {
    return [...new Set(filteredTasks.map((task) => task.status))];
  }, [filteredTasks]);
  const activeBoardData = BOARDS.find((board) => board._id === activeBoard);

  const handleBoardChange = (boardId) => {
    setActiveBoard(boardId);
  };

  return (
    <div id="dashboard-layout" className="dashboard-layout">
      <Sidebar activeBoard={activeBoard} onBoardChange={handleBoardChange} />
      <div className="dashboard-main">
        <Navbar 
          boardName={activeBoardData?.name} 
          boardDescription={activeBoardData?.description} 
        />
        <div id="dashboard" className="dashboard">
          {statuses.map((status) => (
            <BoardCard key={status} status={status} tasks={filteredTasks} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;