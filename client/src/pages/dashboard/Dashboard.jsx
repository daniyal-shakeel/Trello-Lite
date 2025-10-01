import BoardCard from "../../components/board-cards/BoardCard";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { TASKS } from "../../assets/data/tasks";
import { BOARDS } from "../../assets/data/boards";
import "./Dashboard.css";
import { useState, useMemo, useEffect } from "react";

const Dashboard = () => {
  const [activeBoard, setActiveBoard] = useState(BOARDS[0]?._id || null);
  const [taskLoading, setTaskLoading] = useState(true);
  const [boardLoading, setBoardLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => task.boardId === activeBoard);
  }, [tasks, activeBoard]);

  const statuses = useMemo(() => {
    return [...new Set(filteredTasks.map((task) => task.status))];
  }, [filteredTasks]);

  const activeBoardData = BOARDS.find((board) => board._id === activeBoard);

  const handleBoardChange = (boardId) => {
    setActiveBoard(boardId);
  };

  useEffect(() => {
    setTaskLoading(true);
    const timer = setTimeout(() => {
      setTasks(TASKS);
      setTaskLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setBoardLoading(true);
    const timer = setTimeout(() => {
      setBoards(BOARDS);
      setBoardLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Placeholder statuses for skeletons
  const statusesToRender = taskLoading
    ? ["To Do", "In Progress", "Done"]
    : statuses;

  return (
    <div id="dashboard-layout" className="dashboard-layout">
      <Sidebar
        activeBoard={activeBoard}
        onBoardChange={handleBoardChange}
        boardLoading={boardLoading}
        boards={boards}
      />
      <div className="dashboard-main">
        <Navbar
          taskLoading={taskLoading}
          boardName={activeBoardData?.name}
          boardDescription={activeBoardData?.description}
        />
        <div id="dashboard" className="dashboard">
          {statusesToRender.map((status) => (
            <BoardCard
              key={status}
              status={status}
              tasks={filteredTasks}
              taskLoading={taskLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
