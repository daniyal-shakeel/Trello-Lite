import BoardCard from "../../components/board-cards/BoardCard";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Dashboard.css";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import BoardCardSkeleton from "../../components/skeletons/board-card/BoardCardSkeleton";
import { getApiUri } from "../../utils/getUri";

const Dashboard = ({ setAuth, user }) => {
  const [activeBoard, setActiveBoard] = useState(null);
  const [taskLoading, setTaskLoading] = useState(true);
  const [boardLoading, setBoardLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [activeStatus, setActiveStatus] = useState("active");

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
    return boards.filter((board) => board.status === activeStatus);
  }, [boards, activeStatus]);

  useEffect(() => console.log(boards), [boards]);

  const handleBoardChange = (boardId) => {
    setActiveBoard(boardId);
  };

  const getAllBoards = async () => {
    setBoardLoading(true);
    try {
      const res = await axios.get(getApiUri("/api/board/get-all-boards"), {
        withCredentials: true,
      });

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
    if (!activeBoard) return;
    try {
      const res = await axios.get(
        getApiUri(`/api/task/get-all-tasks/${activeBoard}`),
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
    if (activeBoard) getAllTasks();
  }, [activeBoard]);

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
          tasks={tasks}
          setTasks={setTasks}
          activeBoard={activeBoard}
          boards={boards}
          taskLoading={taskLoading}
          statuses={["active", "draft", "archived"]}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />
        <div id="dashboard" className="dashboard">
          {boardLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <BoardCardSkeleton key={index} />
            ))
          ) : filteredBoards.length > 0 ? (
            [...filteredBoards]
              .sort((a, b) =>
                a._id === activeBoard ? -1 : b._id === activeBoard ? 1 : 0
              )
              .map((board) => (
                <BoardCard
                  activeBoard={activeBoard}
                  isShared={board.isShared}
                  key={board._id}
                  boardId={board._id}
                  name={board.name}
                  status={board.status}
                  tasks={tasks.filter((task) => task.boardId === board._id)}
                  setTasks={setTasks}
                  loading={taskLoading}
                  setBoards={setBoards}
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
