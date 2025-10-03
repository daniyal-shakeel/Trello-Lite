import BoardCard from "../../components/board-cards/BoardCard";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Dashboard.css";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";

const Dashboard = ({ setAuth, user }) => {
  const [activeBoard, setActiveBoard] = useState(null);
  const [taskLoading, setTaskLoading] = useState(true);
  const [boardLoading, setBoardLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [activeStatus, setActiveStatus] = useState("active");

  const activeBoards = useMemo(() => {
    return boards.filter((board) => board.status === "active");
  }, [boards]);

  useEffect(() => {
    if (boards.length > 0) {
      if (!activeBoard || !boards.find((b) => b._id === activeBoard)) {
        setActiveBoard(boards[0]._id);
      }
    } else {
      setActiveBoard(null);
    }
  }, [boards, activeBoard]);

  const filteredBoards = useMemo(() => {
    if (activeStatus === "all") return boards;
    return boards.filter((board) => board.status === activeStatus);
  }, [boards, activeStatus]);

  useEffect(() => console.log(boards), [boards]);

  const handleBoardChange = (boardId) => {
    setActiveBoard(boardId);
  };

  const getAllBoards = async () => {
    setBoardLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/board/get-all-boards`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setBoards(res.data.boards || []);
      } else {
        console.error("Failed to fetch boards:", res.data.message);
        setBoards([]);
      }
    } catch (error) {
      console.error("An error occurred in getAllBoards:", error.message);
      setBoards([]);
    } finally {
      setBoardLoading(false);
    }
  };

  const getAllTasks = async () => {
    setTaskLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/task/get-all-tasks`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setTasks(res.data.tasks || []);
      } else {
        console.error("Failed to fetch tasks:", res.data.message);
        setTasks([]);
      }
    } catch (error) {
      console.error("An error occurred in getAllTasks: ", error.message);
      setTasks([]);
    } finally {
      setTaskLoading(false);
    }
  };

  useEffect(() => {
    getAllBoards();
  }, []);

  useEffect(() => {
    getAllTasks();
  }, []);

  useEffect(() => console.log(activeBoard), [activeBoard]);

  return (
    <div id="dashboard-layout" className="dashboard-layout">
      <Sidebar
        getAllBoards={getAllBoards}
        setAuth={setAuth}
        activeBoard={activeBoard}
        onBoardChange={handleBoardChange}
        boardLoading={boardLoading}
        boards={filteredBoards}
        user={user}
        setBoards={setBoards}
      />
      <div className="dashboard-main">
        <Navbar
          taskLoading={taskLoading}
          statuses={["active", "draft", "archived"]}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />
        <div id="dashboard" className="dashboard">
          {filteredBoards.length > 0 ? (
            filteredBoards.map((board) => (
              <BoardCard
                key={board._id}
                boardId={board._id}
                name={board.name}
                status={board.status}
                tasks={tasks.filter((task) => task.boardId === board._id)}
                taskLoading={taskLoading}
              />
            ))
          ) : (
            <p className="empty-message">
              No boards found for "{activeStatus}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
